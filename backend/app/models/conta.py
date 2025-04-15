from pydantic import BaseModel, Field
from typing import Optional
from datetime import date
from uuid import uuid4

class ContaCreate(BaseModel):
    descricao: str
    valor: float
    vencimento: date
    recorrente: bool = False
    inicio_periodo: Optional[str] = None  # formato 'YYYY-MM'
    fim_periodo: Optional[str] = None
    status: Optional[str] = "pendente"

class ContaDB(ContaCreate):
    id: str = Field(default_factory=lambda: str(uuid4()), alias="_id")

    class Config:
        allow_population_by_field_name = True
        json_encoders = {
            date: lambda d: d.isoformat()
        }
