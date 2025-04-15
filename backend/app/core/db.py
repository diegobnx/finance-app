from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import MONGO_URI, DATABASE_NAME

client: AsyncIOMotorClient = None
db = None

async def connect_to_mongo():
    global client, db
    client = AsyncIOMotorClient(MONGO_URI)
    db = client[DATABASE_NAME]
    print("✅ Conectado ao MongoDB!")

async def close_mongo_connection():
    global client
    if client:
        client.close()
        print("🛑 Conexão com MongoDB encerrada.")
