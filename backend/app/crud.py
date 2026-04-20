from sqlalchemy.orm import Session

from app.models import Ecoponto
from app.schemas import EcopontoCreate, EcopontoUpdate

# ========================================
#  Funcoes de acesso ao banco - Ecopontos
# ========================================


def listar_ecopontos(db: Session, tipo_residuo: str | None = None):
    query = db.query(Ecoponto)
    if tipo_residuo:
        query = query.filter(Ecoponto.tipos_residuo.ilike(f"%{tipo_residuo}%"))
    return query.all()


def obter_ecoponto(db: Session, ecoponto_id: int):
    return db.query(Ecoponto).filter(Ecoponto.id == ecoponto_id).first()


def criar_ecoponto(db: Session, dados: EcopontoCreate):
    novo = Ecoponto(**dados.model_dump())
    db.add(novo)
    db.commit()
    db.refresh(novo)
    return novo


def atualizar_ecoponto(db: Session, ecoponto_id: int, dados: EcopontoUpdate):
    ecoponto = db.query(Ecoponto).filter(Ecoponto.id == ecoponto_id).first()
    if not ecoponto:
        return None
    for campo, valor in dados.model_dump().items():
        setattr(ecoponto, campo, valor)
    db.commit()
    db.refresh(ecoponto)
    return ecoponto


def remover_ecoponto(db: Session, ecoponto_id: int):
    ecoponto = db.query(Ecoponto).filter(Ecoponto.id == ecoponto_id).first()
    if not ecoponto:
        return False
    db.delete(ecoponto)
    db.commit()
    return True
