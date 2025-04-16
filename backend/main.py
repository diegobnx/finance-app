import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), ".")))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1 import contas
from app.core.db import engine, Base

app = FastAPI(title="Controle Financeiro", version="1.0.0")

# CORS (ajustar conforme necessidade do frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://192.168.0.110:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rotas
app.include_router(contas.router, prefix="/api/v1/contas", tags=["Contas"])


# Eventos de startup/shutdown
@app.on_event("startup")
async def startup_event():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
