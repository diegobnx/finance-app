from pydantic import BaseModel, validator
from typing import Optional
from datetime import date

class ContaBase(BaseModel):
    descricao: str
    valor: float
    vencimento: Optional[date] = None
    recorrente: Optional[bool] = False
    quantidade_parcelas: Optional[int] = None  # Usada apenas quando recorrente=True e inicio_periodo/fim_periodo não fornecidos
    inicio_periodo: Optional[date] = None
    fim_periodo: Optional[date] = None
    status: Optional[str] = "pendente"
    dia_vencimento: Optional[int] = None

    @validator("vencimento", "inicio_periodo", "fim_periodo", pre=True)
    def parse_date(cls, value):
        print(f"🧪 Debug: Converting value '{value}' to date")
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
    pass

class ContaResponse(ContaBase):
    id: str

    class Config:
        from_attributes = True
