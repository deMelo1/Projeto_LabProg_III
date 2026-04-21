from sqlalchemy import func, extract
from sqlalchemy.orm import Session

from app.models import Ecoponto, Descarte
from app.schemas import EcopontoCreate, EcopontoUpdate, DescarteCreate

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


# ========================================
#  Funcoes de acesso ao banco - Descartes
# ========================================


def listar_descartes(db: Session, tipo_residuo: str | None = None):
    query = db.query(Descarte).order_by(Descarte.data_descarte.desc())
    if tipo_residuo:
        query = query.filter(Descarte.tipo_residuo.ilike(f"%{tipo_residuo}%"))
    return query.all()


def criar_descarte(db: Session, dados: DescarteCreate):
    novo = Descarte(**dados.model_dump())
    db.add(novo)
    db.commit()
    db.refresh(novo)
    return novo


def obter_estatisticas(db: Session):
    total = db.query(func.count(Descarte.id)).scalar()

    # descartes agrupados por tipo de residuo
    por_tipo_rows = (
        db.query(Descarte.tipo_residuo, func.count(Descarte.id))
        .group_by(Descarte.tipo_residuo)
        .all()
    )
    por_tipo = {row[0]: row[1] for row in por_tipo_rows}

    # descartes agrupados por mes (ultimos registros)
    por_mes_rows = (
        db.query(
            extract("year", Descarte.data_descarte).label("ano"),
            extract("month", Descarte.data_descarte).label("mes"),
            func.count(Descarte.id).label("quantidade"),
        )
        .group_by("ano", "mes")
        .order_by("ano", "mes")
        .all()
    )
    por_mes = [
        {"ano": int(row.ano), "mes": int(row.mes), "quantidade": row.quantidade}
        for row in por_mes_rows
    ]

    return {
        "total_descartes": total,
        "descartes_por_tipo": por_tipo,
        "descartes_por_mes": por_mes,
    }
