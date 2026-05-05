from datetime import datetime
from pydantic import BaseModel, ConfigDict

# ========================================
#  Schemas de validacao (Pydantic)
# ========================================


# ---------- Ecoponto ----------

class EcopontoBase(BaseModel):
    nome: str
    endereco: str
    cidade: str
    estado: str
    latitude: float | None = None
    longitude: float | None = None
    tipos_residuo: str
    descricao: str | None = None


class EcopontoCreate(EcopontoBase):
    """Dados para criar um ecoponto (body do POST)."""
    pass


class EcopontoUpdate(EcopontoBase):
    """Dados para atualizar um ecoponto (body do PUT)."""
    pass


class EcopontoResponse(EcopontoBase):
    """Resposta da API com id e data de criacao."""
    id: int
    criado_em: datetime

    model_config = ConfigDict(from_attributes=True)


# ---------- Descarte ----------

class DescarteBase(BaseModel):
    ecoponto_id: int | None = None
    tipo_residuo: str
    descricao: str | None = None


class DescarteCreate(DescarteBase):
    """Dados para registrar um descarte (body do POST)."""
    pass


class DescarteResponse(DescarteBase):
    """Resposta da API com id e data do descarte."""
    id: int
    data_descarte: datetime
    ecoponto_nome: str | None = None

    model_config = ConfigDict(from_attributes=True)


class EstatisticasResponse(BaseModel):
    """Estatisticas gerais de descarte."""
    total_descartes: int
    descartes_por_tipo: dict[str, int]
    descartes_por_mes: list[dict]


# ---------- Classificacao (F3) ----------

class ClassificacaoResponse(BaseModel):
    """Resposta da classificacao de uma imagem de residuo."""
    id: int
    nome_arquivo: str
    arquivo_salvo: str
    tipo_residuo: str
    confianca: float
    orientacao: str
    data_classificacao: datetime

    model_config = ConfigDict(from_attributes=True)
