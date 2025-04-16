import datetime
from decimal import Decimal
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.conta import Conta
from app.schemas.conta import ContaCreate
from typing import Union, List

async def criar_conta_recorrente(*args, **kwargs):
    raise NotImplementedError("Função criar_conta_recorrente ainda não implementada.")

async def criar_conta(db: AsyncSession, conta_data: ContaCreate) -> Union[Conta, List[Conta]]:
    conta_dict = conta_data.dict()
    conta_dict["valor"] = Decimal(str(conta_data.valor))

    dia_vencimento = conta_data.dia_vencimento
    recorrente = conta_data.recorrente or False
    inicio_periodo = conta_data.inicio_periodo
    fim_periodo = conta_data.fim_periodo

    if recorrente and inicio_periodo and fim_periodo:
        try:
            inicio = datetime.datetime.strptime(inicio_periodo, "%Y-%m-%d").date()
            fim = datetime.datetime.strptime(fim_periodo, "%Y-%m-%d").date()
        except ValueError:
            raise ValueError("Formato inválido para inicio_periodo ou fim_periodo (esperado: YYYY-MM-DD)")

        if not dia_vencimento:
            if not conta_data.vencimento:
                raise ValueError("Campo 'vencimento' ou 'dia_vencimento' é obrigatório para contas recorrentes.")
            try:
                vencimento_ref = datetime.datetime.strptime(conta_data.vencimento, "%Y-%m-%d")
                vencimento_dia = vencimento_ref.day
            except ValueError:
                raise ValueError("Formato de data inválido para vencimento (esperado: YYYY-MM-DD)")
        else:
            vencimento_dia = int(dia_vencimento)

        contas = []
        while inicio <= fim:
            try:
                vencimento = datetime.date(inicio.year, inicio.month, vencimento_dia)
            except ValueError:
                next_month = inicio.replace(day=28) + datetime.timedelta(days=4)
                last_day = (next_month - datetime.timedelta(days=next_month.day)).day
                vencimento = datetime.date(inicio.year, inicio.month, last_day)

            conta_data_copy = conta_dict.copy()
            conta_data_copy["vencimento"] = vencimento
            nova_conta = Conta(**conta_data_copy)
            db.add(nova_conta)
            contas.append(nova_conta)
            inicio = (inicio.replace(day=28) + datetime.timedelta(days=4)).replace(day=1)

        await db.commit()
        for conta in contas:
            await db.refresh(conta)
        return contas

    else:
        if not conta_data.vencimento:
            raise ValueError("Campo 'vencimento' é obrigatório para contas não recorrentes.")
        try:
            conta_dict["vencimento"] = datetime.datetime.strptime(conta_data.vencimento, "%Y-%m-%d").date()
        except ValueError:
            raise ValueError("Formato de data inválido para vencimento (esperado: YYYY-MM-DD)")
        nova_conta = Conta(**conta_dict)
        db.add(nova_conta)
        await db.commit()
        await db.refresh(nova_conta)
        return nova_conta

async def listar_contas(db: AsyncSession):
    result = await db.execute(select(Conta))
    return result.scalars().all()
