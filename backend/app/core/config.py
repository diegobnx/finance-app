import os
from dotenv import load_dotenv

load_dotenv()  # Carrega variáveis do .env

MONGO_URI = os.getenv("MONGO_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME")

if not MONGO_URI or not DATABASE_NAME:
    raise ValueError("Variáveis de ambiente MONGO_URI e DATABASE_NAME são obrigatórias.")
