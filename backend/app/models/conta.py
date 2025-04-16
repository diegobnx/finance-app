from sqlalchemy import Column, Integer, String, Boolean, Date, JSON, Float, Numeric
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.ext.mutable import MutableDict
from sqlalchemy.orm import declarative_base
from uuid import uuid4

from app.core.db import Base

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
    quantidade_parcelas = Column(Integer, nullable=True)
    numero_parcela = Column(Integer, nullable=True)
    total_parcelas = Column(Integer, nullable=True)
    quantidade_parcelas = Column(Integer, nullable=True)
    numero_parcela = Column(Integer, nullable=True)
    total_parcelas = Column(Integer, nullable=True)
    __repr__ = lambda self: f"<Conta {self.descricao}, Parcela {self.numero_parcela}/{self.total_parcelas}>"
