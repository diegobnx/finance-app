from pydantic import BaseModel, validator, model_validator
from typing import Optional
from enum import Enum
from datetime import date

class StatusEnum(str, Enum):
    pendente = "pendente"
    pago = "pago"
    vencida = "vencida"

class ContaBase(BaseModel):
    descricao: str
    valor: float
    vencimento: Optional[date] = None
    recorrente: Optional[bool] = False
    quantidade_parcelas: Optional[int] = None
    inicio_periodo: Optional[date] = None
    fim_periodo: Optional[date] = None
    status: StatusEnum = StatusEnum.pendente
    dia_vencimento: Optional[int] = None
    numero_parcela: Optional[int] = None
    total_parcelas: Optional[int] = None

    @validator("vencimento", "inicio_periodo", "fim_periodo", pre=True)
    def parse_date(cls, value):
        if isinstance(value, str):
            return date.fromisoformat(value)
        return value

    @validator("dia_vencimento")
    def validate_dia_vencimento(cls, value):
        if value is not None and not (1 <= value <= 31):
            raise ValueError("O dia_vencimento deve estar entre 1 e 31.")
        return value

    @validator("quantidade_parcelas")
    def validate_quantidade_parcelas(cls, value, values):
        if value is not None:
            if value <= 0:
                raise ValueError("A quantidade de parcelas deve ser maior que zero.")
        return value

class ContaCreate(ContaBase):
    descricao: str
    valor: float
    recorrente: Optional[bool] = False
    vencimento: Optional[date] = None
    quantidade_parcelas: Optional[int] = None
    inicio_periodo: Optional[date] = None
    fim_periodo: Optional[date] = None
    status: StatusEnum = StatusEnum.pendente
    dia_vencimento: Optional[int] = None

    @model_validator(mode="after")
    def validate_recorrente_fields(cls, values):
        if values.recorrente:
            if not values.quantidade_parcelas:
                raise ValueError("Campo 'quantidade_parcelas' é obrigatório para contas recorrentes.")
            if not (values.vencimento or values.dia_vencimento):
                raise ValueError("Envie 'vencimento' ou 'dia_vencimento' em contas recorrentes.")
        return values

class ContaResponse(ContaBase):
    id: str
    numero_parcela: Optional[int] = None
    total_parcelas: Optional[int] = None

    class Config:
        from_attributes = True

class ContaResponseParcela(ContaResponse):
    pass
