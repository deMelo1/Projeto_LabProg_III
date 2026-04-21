from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.database import engine, get_db, Base
from app.models import Ecoponto, Descarte  # noqa: F401
from app.schemas import (
    EcopontoCreate, EcopontoUpdate, EcopontoResponse,
    DescarteCreate, DescarteResponse, EstatisticasResponse,
)
from app import crud

# cria as tabelas no banco se ainda nao existirem
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="EcoFilter API",
    description="API do sistema EcoFilter para descarte correto de resíduos.",
    version="0.2.0",
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

@app.post("/classificacao", tags=["Classificação"])
def classificar_residuo():
    """Recebe uma imagem de resíduo e retorna a classificação e orientação de descarte."""
    return {"mensagem": "endpoint em construção"}
