from pydantic import BaseModel, validator
from typing import Optional
from datetime import date

class ContaBase(BaseModel):
    descricao: str
    valor: float
    vencimento: Optional[date] = None
    recorrente: Optional[bool] = False
    inicio_periodo: Optional[date] = None
    fim_periodo: Optional[date] = None
    status: Optional[str] = "pendente"
    dia_vencimento: Optional[int] = None

    @validator("vencimento", "inicio_periodo", "fim_periodo", pre=True)
    def parse_date(cls, value):
        if isinstance(value, str):
            return date.fromisoformat(value)
        return value

class ContaCreate(ContaBase):
    pass

class ContaResponse(ContaBase):
    id: str

    class Config:
        from_attributes = True
