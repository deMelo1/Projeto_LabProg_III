import os

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# ========================================
#  Configuracao do banco de dados
# ========================================

# pega a url do banco definida no docker-compose
# se nao tiver (ex: rodando local sem docker), usa sqlite como fallback
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./ecofilter.db")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)

Base = declarative_base()


def get_db():
    """Abre uma sessao e garante que ela fecha no final."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
