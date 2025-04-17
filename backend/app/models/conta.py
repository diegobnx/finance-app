from sqlalchemy import Column, Integer, String, Boolean, Date, Numeric
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.ext.mutable import MutableDict
from sqlalchemy.orm import declarative_base
from uuid import uuid4
from sqlalchemy import Enum as PgEnum
from enum import Enum

from app.core.db import Base

class StatusEnum(str, Enum):
    pendente = "pendente"
    pago = "pago"
    vencida = "vencida"

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
    status = Column(PgEnum(StatusEnum, name="status_enum"), default=StatusEnum.pendente, nullable=False)
    dia_vencimento = Column(Integer, nullable=True)
    quantidade_parcelas = Column(Integer, nullable=True)
    numero_parcela = Column(Integer, nullable=True)
    total_parcelas = Column(Integer, nullable=True)

    def __repr__(self):
        return f"<Conta {self.descricao} {self.numero_parcela or ''}/{self.total_parcelas or ''} - {self.status}>"
