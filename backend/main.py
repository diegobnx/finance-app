import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), ".")))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1 import contas
from app.core.db import connect_to_mongo, close_mongo_connection

app = FastAPI(title="Controle Financeiro", version="1.0.0")

# CORS (ajustar conforme necessidade do frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ou ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rotas
app.include_router(contas.router, prefix="/api/v1/contas", tags=["Contas"])


# Eventos de startup/shutdown
@app.on_event("startup")
async def startup_event():
    await connect_to_mongo()


@app.on_event("shutdown")
async def shutdown_event():
    await close_mongo_connection()
