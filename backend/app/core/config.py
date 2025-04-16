import os

MONGO_URI = os.getenv("MONGO_URI", "mongodb://mongo:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "financeapp")
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:postgres@postgres:5432/financeapp")

if not MONGO_URI or not DATABASE_NAME:
    raise ValueError("Variáveis de ambiente MONGO_URI e DATABASE_NAME são obrigatórias.")
