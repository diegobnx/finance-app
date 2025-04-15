from fastapi import APIRouter, HTTPException
from typing import List
from app.models.conta import ContaCreate, ContaDB
from app.core.db import get_db

router = APIRouter()

@router.get("/", response_model=List[ContaDB])
async def listar_contas():
    print("📥 Rota GET /api/v1/contas acessada")
    db = get_db()
    if db is None:
        raise HTTPException(status_code=500, detail="DB não inicializado")
    contas = await db["contas"].find().to_list(100)
    return contas

@router.post("/", response_model=ContaDB)
async def criar_conta(conta: ContaCreate):
    db = get_db()
    if db is None:
        raise HTTPException(status_code=500, detail="DB não inicializado")
    conta_dict = conta.dict()
    result = await db["contas"].insert_one(conta_dict)
    conta_dict["_id"] = str(result.inserted_id)
    return ContaDB(**conta_dict)

@router.get("/{conta_id}", response_model=ContaDB)
async def obter_conta(conta_id: str):
    db = get_db()
    if db is None:
        raise HTTPException(status_code=500, detail="DB não inicializado")
    conta = await db["contas"].find_one({"_id": conta_id})
    if not conta:
        raise HTTPException(status_code=404, detail="Conta não encontrada")
    return ContaDB(**conta)

@router.put("/{conta_id}", response_model=ContaDB)
async def atualizar_conta(conta_id: str, conta: ContaCreate):
    db = get_db()
    if db is None:
        raise HTTPException(status_code=500, detail="DB não inicializado")
    result = await db["contas"].find_one_and_update(
        {"_id": conta_id},
        {"$set": conta.dict()},
        return_document=True
    )
    if not result:
        raise HTTPException(status_code=404, detail="Conta não encontrada")
    return ContaDB(**result)

@router.delete("/{conta_id}")
async def deletar_conta(conta_id: str):
    db = get_db()
    if db is None:
        raise HTTPException(status_code=500, detail="DB não inicializado")
    result = await db["contas"].delete_one({"_id": conta_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Conta não encontrada")
    return {"mensagem": "Conta deletada com sucesso"}
