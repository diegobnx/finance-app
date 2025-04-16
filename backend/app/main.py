import sys
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.errors import ServerErrorMiddleware

from api.v1 import contas
from core.db import engine, Base

app = FastAPI(title="Controle Financeiro", version="1.0.0")

app.add_middleware(ServerErrorMiddleware, debug=True)

# CORS (ajustar conforme necessidade do frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rotas
try:
    app.include_router(contas.router, prefix="/api/v1/contas", tags=["Contas"])
except Exception as e:
    import logging
    logging.exception("Erro ao incluir o router de contas")


# Eventos de startup/shutdown
@app.on_event("startup")
async def startup_event():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
