import os

DATABASE_NAME = os.getenv("DATABASE_NAME", "financeapp")
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:postgres@postgres:5432/financeapp")

if not DATABASE_URL or not DATABASE_NAME:
    raise ValueError(
        "Variáveis de ambiente DATABASE_URL e DATABASE_NAME são obrigatórias."
    )
