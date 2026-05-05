import os
import uuid
from pathlib import Path

from fastapi import FastAPI, Depends, HTTPException, Query, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.database import engine, get_db, Base
from app.models import Ecoponto, Descarte, Classificacao  # noqa: F401
from app.schemas import (
    EcopontoCreate, EcopontoUpdate, EcopontoResponse,
    DescarteCreate, DescarteResponse, EstatisticasResponse,
    ClassificacaoResponse,
)
from app import crud
from app.classificador import classificar

# cria as tabelas no banco se ainda nao existirem
Base.metadata.create_all(bind=engine)

# diretorio onde as imagens classificadas ficam salvas
UPLOAD_DIR = Path(os.getenv("UPLOAD_DIR", "/app/uploads"))
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# extensoes aceitas no upload
EXTENSOES_VALIDAS = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp"}
TAMANHO_MAX_MB = 8

app = FastAPI(
    title="EcoFilter API",
    description="API do sistema EcoFilter para descarte correto de resíduos.",
    version="0.3.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------- Healthcheck ----------

@app.get("/health", tags=["Status"])
def healthcheck():
    """Verifica se a API está no ar."""
    return {"status": "ok"}


# ---------- F1 – Ecopontos (pontos de coleta) ----------

@app.get("/ecopontos", tags=["Ecopontos"], response_model=list[EcopontoResponse])
def listar_ecopontos(
    tipo_residuo: str | None = Query(None, description="Filtrar por tipo de resíduo"),
    db: Session = Depends(get_db),
):
    """Lista todos os pontos de coleta cadastrados. Aceita filtro por tipo de resíduo."""
    return crud.listar_ecopontos(db, tipo_residuo=tipo_residuo)


@app.get("/ecopontos/{ecoponto_id}", tags=["Ecopontos"], response_model=EcopontoResponse)
def obter_ecoponto(ecoponto_id: int, db: Session = Depends(get_db)):
    """Retorna os dados de um ponto de coleta específico."""
    ecoponto = crud.obter_ecoponto(db, ecoponto_id)
    if not ecoponto:
        raise HTTPException(status_code=404, detail="Ecoponto não encontrado")
    return ecoponto


@app.post("/ecopontos", tags=["Ecopontos"], response_model=EcopontoResponse, status_code=201)
def criar_ecoponto(dados: EcopontoCreate, db: Session = Depends(get_db)):
    """Cadastra um novo ponto de coleta."""
    return crud.criar_ecoponto(db, dados)


@app.put("/ecopontos/{ecoponto_id}", tags=["Ecopontos"], response_model=EcopontoResponse)
def atualizar_ecoponto(ecoponto_id: int, dados: EcopontoUpdate, db: Session = Depends(get_db)):
    """Atualiza os dados de um ponto de coleta."""
    ecoponto = crud.atualizar_ecoponto(db, ecoponto_id, dados)
    if not ecoponto:
        raise HTTPException(status_code=404, detail="Ecoponto não encontrado")
    return ecoponto


@app.delete("/ecopontos/{ecoponto_id}", tags=["Ecopontos"])
def remover_ecoponto(ecoponto_id: int, db: Session = Depends(get_db)):
    """Remove um ponto de coleta."""
    removido = crud.remover_ecoponto(db, ecoponto_id)
    if not removido:
        raise HTTPException(status_code=404, detail="Ecoponto não encontrado")
    return {"detail": "Ecoponto removido com sucesso"}


# ---------- F2 – Histórico e estatísticas de descarte ----------

@app.get("/descartes", tags=["Descartes"], response_model=list[DescarteResponse])
def listar_descartes(
    tipo_residuo: str | None = Query(None, description="Filtrar por tipo de resíduo"),
    db: Session = Depends(get_db),
):
    """Lista o histórico de descartes registrados. Aceita filtro por tipo de resíduo."""
    descartes = crud.listar_descartes(db, tipo_residuo=tipo_residuo)
    resultado = []
    for d in descartes:
        nome_ecoponto = d.ecoponto.nome if d.ecoponto else None
        resultado.append(DescarteResponse(
            id=d.id,
            ecoponto_id=d.ecoponto_id,
            tipo_residuo=d.tipo_residuo,
            descricao=d.descricao,
            data_descarte=d.data_descarte,
            ecoponto_nome=nome_ecoponto,
        ))
    return resultado


@app.post("/descartes", tags=["Descartes"], response_model=DescarteResponse, status_code=201)
def registrar_descarte(dados: DescarteCreate, db: Session = Depends(get_db)):
    """Registra um novo descarte realizado."""
    if dados.ecoponto_id:
        ecoponto = crud.obter_ecoponto(db, dados.ecoponto_id)
        if not ecoponto:
            raise HTTPException(status_code=404, detail="Ecoponto não encontrado")
    descarte = crud.criar_descarte(db, dados)
    nome_ecoponto = descarte.ecoponto.nome if descarte.ecoponto else None
    return DescarteResponse(
        id=descarte.id,
        ecoponto_id=descarte.ecoponto_id,
        tipo_residuo=descarte.tipo_residuo,
        descricao=descarte.descricao,
        data_descarte=descarte.data_descarte,
        ecoponto_nome=nome_ecoponto,
    )


@app.get("/descartes/estatisticas", tags=["Descartes"], response_model=EstatisticasResponse)
def estatisticas_descartes(db: Session = Depends(get_db)):
    """Retorna estatísticas simples de uso (quantidade de descartes por tipo e por mês)."""
    return crud.obter_estatisticas(db)


# ---------- F3 – Classificação de resíduos por imagem ----------

@app.post(
    "/classificacao",
    tags=["Classificação"],
    response_model=ClassificacaoResponse,
    status_code=201,
)
async def classificar_residuo(
    arquivo: UploadFile = File(..., description="Imagem do resíduo a ser classificado"),
    db: Session = Depends(get_db),
):
    """Recebe uma imagem de resíduo, classifica-a e retorna a categoria + orientação de descarte."""
    nome_original = arquivo.filename or "imagem"
    extensao = Path(nome_original).suffix.lower()
    if extensao not in EXTENSOES_VALIDAS:
        raise HTTPException(
            status_code=400,
            detail=f"Extensao nao suportada. Use: {', '.join(sorted(EXTENSOES_VALIDAS))}",
        )

    conteudo = await arquivo.read()
    if len(conteudo) == 0:
        raise HTTPException(status_code=400, detail="Arquivo vazio")
    if len(conteudo) > TAMANHO_MAX_MB * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail=f"Arquivo excede o tamanho maximo de {TAMANHO_MAX_MB} MB",
        )

    # gera nome unico e salva em disco
    arquivo_salvo = f"{uuid.uuid4().hex}{extensao}"
    caminho = UPLOAD_DIR / arquivo_salvo
    caminho.write_bytes(conteudo)

    # roda classificador simulado
    resultado = classificar(nome_original, conteudo)

    nova = crud.criar_classificacao(
        db,
        nome_arquivo=nome_original,
        arquivo_salvo=arquivo_salvo,
        tipo_residuo=resultado["tipo_residuo"],
        confianca=resultado["confianca"],
        orientacao=resultado["orientacao"],
    )
    return nova


@app.get("/classificacao", tags=["Classificação"], response_model=list[ClassificacaoResponse])
def listar_classificacoes(
    tipo_residuo: str | None = Query(None, description="Filtrar por tipo de resíduo"),
    db: Session = Depends(get_db),
):
    """Lista o histórico de classificações realizadas."""
    return crud.listar_classificacoes(db, tipo_residuo=tipo_residuo)


@app.get("/classificacao/{classificacao_id}", tags=["Classificação"], response_model=ClassificacaoResponse)
def obter_classificacao(classificacao_id: int, db: Session = Depends(get_db)):
    """Retorna os dados de uma classificação específica."""
    item = crud.obter_classificacao(db, classificacao_id)
    if not item:
        raise HTTPException(status_code=404, detail="Classificação não encontrada")
    return item


@app.get("/classificacao/{classificacao_id}/imagem", tags=["Classificação"])
def obter_imagem_classificacao(classificacao_id: int, db: Session = Depends(get_db)):
    """Devolve a imagem original da classificação."""
    item = crud.obter_classificacao(db, classificacao_id)
    if not item:
        raise HTTPException(status_code=404, detail="Classificação não encontrada")
    caminho = UPLOAD_DIR / item.arquivo_salvo
    if not caminho.exists():
        raise HTTPException(status_code=404, detail="Imagem não encontrada no servidor")
    return FileResponse(caminho)


@app.delete("/classificacao/{classificacao_id}", tags=["Classificação"])
def remover_classificacao(classificacao_id: int, db: Session = Depends(get_db)):
    """Remove uma classificação do histórico (e a imagem associada)."""
    item = crud.remover_classificacao(db, classificacao_id)
    if not item:
        raise HTTPException(status_code=404, detail="Classificação não encontrada")
    caminho = UPLOAD_DIR / item.arquivo_salvo
    if caminho.exists():
        caminho.unlink()
    return {"detail": "Classificação removida com sucesso"}
