import os

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "financeapp")

if not MONGO_URI or not DATABASE_NAME:
    raise ValueError("Variáveis de ambiente MONGO_URI e DATABASE_NAME são obrigatórias.")
