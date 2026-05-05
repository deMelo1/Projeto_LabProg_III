from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship

from app.database import Base

# ========================================
#  Modelos das tabelas do banco
# ========================================


class Ecoponto(Base):
    __tablename__ = "ecopontos"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(150), nullable=False)
    endereco = Column(String(255), nullable=False)
    cidade = Column(String(100), nullable=False)
    estado = Column(String(2), nullable=False)              # UF, ex: "SP"
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    tipos_residuo = Column(String(255), nullable=False)     # separado por virgula
    descricao = Column(Text, nullable=True)
    criado_em = Column(DateTime, server_default=func.now())

    descartes = relationship("Descarte", back_populates="ecoponto")


class Descarte(Base):
    __tablename__ = "descartes"

    id = Column(Integer, primary_key=True, index=True)
    ecoponto_id = Column(Integer, ForeignKey("ecopontos.id"), nullable=True)
    tipo_residuo = Column(String(50), nullable=False)
    descricao = Column(String(255), nullable=True)
    data_descarte = Column(DateTime, server_default=func.now())

    ecoponto = relationship("Ecoponto", back_populates="descartes")


class Classificacao(Base):
    __tablename__ = "classificacoes"

    id = Column(Integer, primary_key=True, index=True)
    nome_arquivo = Column(String(255), nullable=False)
    arquivo_salvo = Column(String(255), nullable=False)   # nome unico no disco
    tipo_residuo = Column(String(50), nullable=False)     # categoria classificada
    confianca = Column(Float, nullable=False)              # 0.0 a 1.0
    orientacao = Column(Text, nullable=False)              # texto de orientacao de descarte
    data_classificacao = Column(DateTime, server_default=func.now())
