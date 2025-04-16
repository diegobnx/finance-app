from sqlalchemy import Column, Integer, String, Boolean, Date, JSON, Float
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.ext.mutable import MutableDict
from sqlalchemy.orm import declarative_base
from uuid import uuid4

from app.core.db import Base

class Conta(Base):
    __tablename__ = "contas"

    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    descricao = Column(String, nullable=False)
    valor = Column(Float, nullable=False)
    vencimento = Column(Date, nullable=False)
    recorrente = Column(Boolean, default=False)
    inicio_periodo = Column(String, nullable=True)
    fim_periodo = Column(String, nullable=True)
    status = Column(String, default="pendente")

from pydantic import BaseModel
from typing import Optional
from datetime import date

class ContaBase(BaseModel):
    descricao: str
    valor: float
    vencimento: date
    recorrente: Optional[bool] = False
    inicio_periodo: Optional[str] = None
    fim_periodo: Optional[str] = None
    status: Optional[str] = "pendente"

class ContaCreate(ContaBase):
    pass

class ContaResponse(ContaBase):
    id: str

    class Config:
        orm_mode = True
