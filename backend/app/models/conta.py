from sqlalchemy import Column, Integer, String, Boolean, Date, JSON, Float, Numeric
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.ext.mutable import MutableDict
from sqlalchemy.orm import declarative_base
from uuid import uuid4

from core.db import Base

class Conta(Base):
    """
    Modelo principal da tabela de contas. Representa tanto contas únicas quanto contas recorrentes,
    com suporte a período de recorrência e definição de dia fixo de vencimento.
    """
    __tablename__ = "contas"

    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    descricao = Column(String, nullable=False)
    valor = Column(Numeric(10, 2), nullable=False)
    vencimento = Column(Date, nullable=True)
    recorrente = Column(Boolean, default=False)
    inicio_periodo = Column(Date, nullable=True)
    fim_periodo = Column(Date, nullable=True)
    status = Column(String, default="pendente")
    dia_vencimento = Column(Integer, nullable=True)

from pydantic import BaseModel
from typing import Optional
from datetime import date

class ContaBase(BaseModel):
    """
    Schema base para criação e resposta de contas. Pode conter informações de vencimento único ou recorrente,
    incluindo intervalo de recorrência e o dia específico do vencimento.
    """
    descricao: str
    valor: float
    vencimento: Optional[date] = None
    recorrente: Optional[bool] = False
    inicio_periodo: Optional[date] = None
    fim_periodo: Optional[date] = None
    status: Optional[str] = "pendente"
    dia_vencimento: Optional[int] = None

class ContaCreate(ContaBase):
    pass

class ContaResponse(ContaBase):
    id: str

    class Config:
        orm_mode = True
