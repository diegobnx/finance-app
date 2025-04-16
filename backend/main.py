import sys
import os
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.errors import ServerErrorMiddleware

from app.api.v1 import contas
from app.core.db import engine, Base

from fastapi.requests import Request

app = FastAPI(title="Controle Financeiro", version="1.0.0")


@app.middleware("http")
async def log_request(request: Request, call_next):
    body = await request.body()
    logger.debug(f"📥 Request body: {body.decode()}")
    response = await call_next(request)
    
    response_body = b""
    async for chunk in response.body_iterator:
        response_body += chunk
    logger.debug(f"📤 Response body: {response_body.decode(errors='ignore')}")
    response.body_iterator = iter([response_body])
    
    return response


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
import asyncio
from sqlalchemy.exc import OperationalError


@app.on_event("startup")
async def startup_event():
    max_attempts = 10
    delay = 2  # seconds

    for attempt in range(1, max_attempts + 1):
        try:
            async with engine.begin() as conn:
                await conn.run_sync(Base.metadata.create_all)
            logger.info("✅ Conectado ao banco com sucesso!")
            break
        except OperationalError as e:
            logger.warning(
                f"⏳ Tentativa {attempt}/{max_attempts} - aguardando banco... {e}"
            )
            await asyncio.sleep(delay)
    else:
        logger.error("❌ Falha ao conectar ao banco após várias tentativas.")
        raise RuntimeError("Banco de dados indisponível.")
