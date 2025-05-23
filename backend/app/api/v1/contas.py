from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.conta import Conta
from typing import List, Union
from app.core.db import get_db
from app.schemas.conta import ContaCreate, ContaUpdate, ContaResponseParcela
from app.services.conta_service import listar_contas as listar, criar_conta as criar
from app.services.conta_service import criar_conta_recorrente

router = APIRouter()

@router.get("/", response_model=List[ContaResponseParcela])
async def listar_contas(db: AsyncSession = Depends(get_db)):
    # print("📥 Rota GET /api/v1/contas acessada")
    return await listar(db)

@router.post("/", response_model=Union[ContaResponseParcela, List[ContaResponseParcela]])
async def criar_conta(conta: ContaCreate, db: AsyncSession = Depends(get_db)):
    if conta.recorrente:
        if not conta.quantidade_parcelas:
            raise HTTPException(
                status_code=400,
                detail="Campo 'quantidade_parcelas' é obrigatório para contas recorrentes."
            )
        return await criar_conta_recorrente(db, conta)
    return await criar(db, conta)

@router.get("/{conta_id}", response_model=ContaResponseParcela)
async def obter_conta(conta_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Conta).where(Conta.id == conta_id))
    conta = result.scalars().first()
    if not conta:
        raise HTTPException(status_code=404, detail="Conta não encontrada")
    return conta

@router.put("/{conta_id}", response_model=ContaResponseParcela)
async def atualizar_conta(conta_id: str, conta: ContaUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Conta).where(Conta.id == conta_id))
    db_conta = result.scalars().first()
    if not db_conta:
        raise HTTPException(status_code=404, detail="Conta não encontrada")

    print("🛠 Atualizando conta:", conta.dict())
    for key, value in conta.dict().items():
        if key not in ("id", "_id") and value is not None:
            setattr(db_conta, key, value)

    await db.commit()
    await db.flush()
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
