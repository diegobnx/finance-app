import datetime
from decimal import Decimal
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.conta import Conta
from app.schemas.conta import ContaCreate
from typing import Union, List

async def criar_conta_recorrente(db: AsyncSession, conta_data: ContaCreate) -> List[Conta]:
    conta_dict = conta_data.model_dump()
    print("🧪 Debug dict recebido:", conta_dict)
    conta_dict["valor"] = Decimal(str(conta_data.valor))

    if not conta_data.quantidade_parcelas or not conta_data.vencimento:
        raise ValueError("Campos 'quantidade_parcelas' e 'vencimento' são obrigatórios para contas recorrentes.")
    if isinstance(conta_data.vencimento, str):
        vencimento_ref = datetime.datetime.strptime(conta_data.vencimento, "%Y-%m-%d").date()
    else:
        vencimento_ref = conta_data.vencimento

    vencimento_dia = conta_data.dia_vencimento if conta_data.dia_vencimento is not None else vencimento_ref.day

    if not (1 <= vencimento_dia <= 31):
        raise ValueError("O campo 'dia_vencimento' deve estar entre 1 e 31.")

    contas = []
    for i in range(conta_data.quantidade_parcelas):
        mes = vencimento_ref.month + i
        ano = vencimento_ref.year + (mes - 1) // 12
        mes = (mes - 1) % 12 + 1
        try:
            vencimento = datetime.date(ano, mes, vencimento_dia)
        except ValueError:
            next_month = datetime.date(ano, mes, 28) + datetime.timedelta(days=4)
            last_day = (next_month - datetime.timedelta(days=next_month.day)).day
            vencimento = datetime.date(ano, mes, last_day)

        conta_data_copy = conta_dict.copy()
        conta_data_copy["numero_parcela"] = i + 1
        conta_data_copy["total_parcelas"] = conta_data.quantidade_parcelas
        conta_data_copy["quantidade_parcelas"] = conta_data.quantidade_parcelas
        
        conta_data_copy["vencimento"] = vencimento
        conta_data_copy.pop("dia_vencimento", None)
        nova_conta = Conta(**conta_data_copy)
        db.add(nova_conta)
        contas.append(nova_conta)

    await db.commit()
    for conta in contas:
        await db.refresh(conta)
    return contas

async def criar_conta(db: AsyncSession, conta_data: ContaCreate) -> Union[Conta, List[Conta]]:
    conta_dict = conta_data.model_dump()
    conta_dict["valor"] = Decimal(str(conta_data.valor))
    conta_dict.pop("dia_vencimento", None)

    dia_vencimento = conta_data.dia_vencimento
    recorrente = conta_data.recorrente or False

    if recorrente and conta_data.quantidade_parcelas:
        return await criar_conta_recorrente(db, conta_data)
    else:
        if not conta_data.vencimento:
            raise ValueError("Campo 'vencimento' é obrigatório para contas não recorrentes.")
        if isinstance(conta_data.vencimento, str):
            conta_dict["vencimento"] = datetime.datetime.strptime(conta_data.vencimento, "%Y-%m-%d").date()
        else:
            conta_dict["vencimento"] = conta_data.vencimento
        nova_conta = Conta(**conta_dict)
        db.add(nova_conta)
        await db.commit()
        await db.refresh(nova_conta)
        return nova_conta

async def listar_contas(db: AsyncSession):
    result = await db.execute(select(Conta))
    return result.scalars().all()
