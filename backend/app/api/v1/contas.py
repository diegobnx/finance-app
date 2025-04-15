from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.core.db import get_db
from app.models.conta import ContaCreate, ContaResponse, Conta
from app.services.conta_service import listar_contas as listar, criar_conta as criar
from sqlalchemy.future import select

router = APIRouter()

@router.get("/", response_model=List[ContaResponse])
async def listar_contas(db: AsyncSession = Depends(get_db)):
    print("📥 Rota GET /api/v1/contas acessada")
    return await listar(db)

@router.post("/", response_model=ContaResponse)
async def criar_conta(conta: ContaCreate, db: AsyncSession = Depends(get_db)):
    return await criar(db, conta.dict())

@router.get("/{conta_id}", response_model=ContaResponse)
async def obter_conta(conta_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Conta).where(Conta.id == conta_id))
    conta = result.scalars().first()
    if not conta:
        raise HTTPException(status_code=404, detail="Conta não encontrada")
    return conta

@router.put("/{conta_id}", response_model=ContaResponse)
async def atualizar_conta(conta_id: str, conta: ContaCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Conta).where(Conta.id == conta_id))
    db_conta = result.scalars().first()
    if not db_conta:
        raise HTTPException(status_code=404, detail="Conta não encontrada")

    for key, value in conta.dict().items():
        setattr(db_conta, key, value)

    await db.commit()
    await db.refresh(db_conta)
    return db_conta

@router.delete("/{conta_id}")
async def deletar_conta(conta_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Conta).where(Conta.id == conta_id))
    conta = result.scalars().first()
    if not conta:
        raise HTTPException(status_code=404, detail="Conta não encontrada")

    await db.delete(conta)
    await db.commit()
    return {"mensagem": "Conta deletada com sucesso"}
