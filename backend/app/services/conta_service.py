from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.conta import Conta
from decimal import Decimal

async def criar_conta(db: AsyncSession, conta_data: dict) -> Conta:
    if "valor" in conta_data:
        conta_data["valor"] = Decimal(str(conta_data["valor"]))
    nova_conta = Conta(**conta_data)
    db.add(nova_conta)
    await db.commit()
    await db.refresh(nova_conta)
    return nova_conta

async def listar_contas(db: AsyncSession) -> list[Conta]:
    result = await db.execute(select(Conta))
    return result.scalars().all()
