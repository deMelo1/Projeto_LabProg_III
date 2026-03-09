from fastapi import FastAPI

app = FastAPI(
    title="EcoFilter API",
    description="API do sistema EcoFilter para descarte correto de resíduos.",
    version="0.1.0",
)


# ---------- Healthcheck ----------

@app.get("/health", tags=["Status"])
def healthcheck():
    """Verifica se a API está no ar."""
    return {"status": "ok"}


# ---------- F1 – Ecopontos (pontos de coleta) ----------

@app.get("/ecopontos", tags=["Ecopontos"])
def listar_ecopontos():
    """Lista todos os pontos de coleta cadastrados."""
    return {"ecopontos": []}


@app.get("/ecopontos/{ecoponto_id}", tags=["Ecopontos"])
def obter_ecoponto(ecoponto_id: int):
    """Retorna os dados de um ponto de coleta específico."""
    return {"ecoponto_id": ecoponto_id, "mensagem": "endpoint em construção"}


@app.post("/ecopontos", tags=["Ecopontos"])
def criar_ecoponto():
    """Cadastra um novo ponto de coleta."""
    return {"mensagem": "endpoint em construção"}


@app.put("/ecopontos/{ecoponto_id}", tags=["Ecopontos"])
def atualizar_ecoponto(ecoponto_id: int):
    """Atualiza os dados de um ponto de coleta."""
    return {"ecoponto_id": ecoponto_id, "mensagem": "endpoint em construção"}


@app.delete("/ecopontos/{ecoponto_id}", tags=["Ecopontos"])
def remover_ecoponto(ecoponto_id: int):
    """Remove um ponto de coleta."""
    return {"ecoponto_id": ecoponto_id, "mensagem": "endpoint em construção"}


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
