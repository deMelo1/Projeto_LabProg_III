from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import engine, get_db, Base
from app.models import Ecoponto, Descarte  # noqa: F401
from app.schemas import EcopontoCreate, EcopontoUpdate, EcopontoResponse
from app import crud

# cria as tabelas no banco se ainda nao existirem
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="EcoFilter API",
    description="API do sistema EcoFilter para descarte correto de resíduos.",
    version="0.2.0",
)


# ---------- Healthcheck ----------

@app.get("/health", tags=["Status"])
def healthcheck():
    """Verifica se a API está no ar."""
    return {"status": "ok"}


# ---------- F1 – Ecopontos (pontos de coleta) ----------

@app.get("/ecopontos", tags=["Ecopontos"], response_model=list[EcopontoResponse])
def listar_ecopontos(db: Session = Depends(get_db)):
    """Lista todos os pontos de coleta cadastrados."""
    return crud.listar_ecopontos(db)


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

@app.get("/descartes", tags=["Descartes"])
def listar_descartes():
    """Lista o histórico de descartes do usuário."""
    return {"descartes": []}


@app.post("/descartes", tags=["Descartes"])
def registrar_descarte():
    """Registra um novo descarte realizado."""
    return {"mensagem": "endpoint em construção"}


@app.get("/descartes/estatisticas", tags=["Descartes"])
def estatisticas_descartes():
    """Retorna estatísticas simples de uso (quantidade de descartes, etc.)."""
    return {"estatisticas": {}}


# ---------- F3 – Classificação de resíduos por imagem ----------

@app.post("/classificacao", tags=["Classificação"])
def classificar_residuo():
    """Recebe uma imagem de resíduo e retorna a classificação e orientação de descarte."""
    return {"mensagem": "endpoint em construção"}
