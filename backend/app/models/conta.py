from sqlalchemy import Column, Integer, String, Boolean, Date, JSON
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.ext.mutable import MutableDict
from sqlalchemy.orm import declarative_base
from uuid import uuid4

from app.core.db import Base

class Conta(Base):
    __tablename__ = "contas"

    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    descricao = Column(String, nullable=False)
    valor = Column(String, nullable=False)
    vencimento = Column(Date, nullable=False)
    recorrente = Column(Boolean, default=False)
    inicio_periodo = Column(String, nullable=True)
    fim_periodo = Column(String, nullable=True)
    status = Column(String, default="pendente")
