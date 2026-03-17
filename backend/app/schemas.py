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
