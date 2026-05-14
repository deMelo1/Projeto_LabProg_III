"""Carga inicial de dados (ecopontos e descartes de exemplo).

Roda com: docker compose exec backend python scripts/seed_data.py
"""

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from app.database import SessionLocal, engine, Base
from app.models import Ecoponto, Descarte


ECOPONTOS_SEED = [
    {
        "nome": "Ecoponto Centro",
        "endereco": "Rua das Flores, 100",
        "cidade": "Sao Paulo",
        "estado": "SP",
        "tipos_residuo": "papel,plastico,vidro",
        "descricao": "Aceita os tipos mais comuns.",
    },
    {
        "nome": "Ecoponto Norte",
        "endereco": "Av. Brasil, 2500",
        "cidade": "Rio de Janeiro",
        "estado": "RJ",
        "tipos_residuo": "eletronico,bateria",
        "descricao": "Eletronicos e baterias.",
    },
    {
        "nome": "Ecoponto Sul",
        "endereco": "Rua Voluntarios da Patria, 50",
        "cidade": "Porto Alegre",
        "estado": "RS",
        "tipos_residuo": "organico,papel,metal",
    },
]


DESCARTES_SEED = [
    {"ecoponto_idx": 0, "tipo_residuo": "plastico", "descricao": "Garrafas pet"},
    {"ecoponto_idx": 0, "tipo_residuo": "papel", "descricao": "Jornais velhos"},
    {"ecoponto_idx": 1, "tipo_residuo": "bateria", "descricao": "Pilhas usadas"},
    {"ecoponto_idx": 2, "tipo_residuo": "organico", "descricao": "Restos de comida"},
]


def seed():
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        if db.query(Ecoponto).count() > 0:
            print("Ja tem dados no banco, nao vou duplicar.")
            return

        criados = []
        for dados in ECOPONTOS_SEED:
            ep = Ecoponto(**dados)
            db.add(ep)
            criados.append(ep)
        db.commit()
        for ep in criados:
            db.refresh(ep)

        for d in DESCARTES_SEED:
            ecoponto = criados[d["ecoponto_idx"]]
            db.add(Descarte(
                ecoponto_id=ecoponto.id,
                tipo_residuo=d["tipo_residuo"],
                descricao=d["descricao"],
            ))
        db.commit()

        print(f"Criados {len(criados)} ecopontos e {len(DESCARTES_SEED)} descartes.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
