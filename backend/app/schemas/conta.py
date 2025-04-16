from pydantic import BaseModel
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

class ContaCreate(ContaBase):
    pass

class ContaResponse(ContaBase):
    id: str

    class Config:
        orm_mode = True
