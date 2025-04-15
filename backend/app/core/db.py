from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import MONGO_URI, DATABASE_NAME

client: AsyncIOMotorClient = None

async def connect_to_mongo():
    global client
    client = AsyncIOMotorClient(MONGO_URI)
    print("✅ Conectado ao MongoDB!")

async def close_mongo_connection():
    global client
    if client:
        client.close()
        print("🛑 Conexão com MongoDB encerrada.")

def get_db():
    return client[DATABASE_NAME] if client else None
