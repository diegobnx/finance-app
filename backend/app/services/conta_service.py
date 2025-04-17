import datetime
from decimal import Decimal
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.conta import Conta
from app.schemas.conta import ContaCreate
from typing import Union, List

def _primeiro_vencimento(
    hoje: datetime.date,
    dia_vencimento: int
) -> datetime.date:
    """Calcula a primeira data de vencimento baseada apenas no dia."""
    try:
        venc = datetime.date(hoje.year, hoje.month, dia_vencimento)
    except ValueError:
        # mês atual não tem esse dia (fev/30 etc) – usa o último dia do mês
        next_month = datetime.date(hoje.year, hoje.month, 28) + datetime.timedelta(days=4)
        last_day = (next_month - datetime.timedelta(days=next_month.day)).day
        venc = datetime.date(hoje.year, hoje.month, min(dia_vencimento, last_day))

    if venc < hoje:
        # Se já passou neste mês, pula para o próximo mês
        next_month = datetime.date(hoje.year, hoje.month, 28) + datetime.timedelta(days=4)
        venc = datetime.date(next_month.year, next_month.month, dia_vencimento)
    return venc

async def criar_conta_recorrente(db: AsyncSession, conta_data: ContaCreate) -> List[Conta]:
    conta_dict = conta_data.model_dump()
    print("🧪 Debug dict recebido:", conta_dict)
    conta_dict["valor"] = Decimal(conta_data.valor) if not isinstance(conta_data.valor, Decimal) else conta_data.valor

    if not conta_data.quantidade_parcelas:
        raise ValueError("Campo 'quantidade_parcelas' é obrigatório para contas recorrentes.")
    if conta_data.vencimento:
        if isinstance(conta_data.vencimento, str):
            vencimento_ref = datetime.datetime.strptime(conta_data.vencimento, "%Y-%m-%d").date()
        else:
            vencimento_ref = conta_data.vencimento
    else:
        # calcular a primeira data apenas a partir do dia_vencimento
        dia_venc = conta_data.dia_vencimento if conta_data.dia_vencimento is not None else datetime.date.today().day
        vencimento_ref = _primeiro_vencimento(datetime.date.today(), dia_venc)

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
        nova_conta = Conta(**conta_data_copy)
        db.add(nova_conta)
        contas.append(nova_conta)

    await db.commit()
    for conta in contas:
        await db.refresh(conta)
    return contas

async def criar_conta(db: AsyncSession, conta_data: ContaCreate) -> Union[Conta, List[Conta]]:
    conta_dict = conta_data.model_dump()
    conta_dict["valor"] = Decimal(conta_data.valor) if not isinstance(conta_data.valor, Decimal) else conta_data.valor
    conta_dict.pop("dia_vencimento", None)

    dia_vencimento = conta_data.dia_vencimento
    recorrente = conta_data.recorrente or False

    if recorrente and conta_data.quantidade_parcelas:
        return await criar_conta_recorrente(db, conta_data)
    else:
        if not conta_data.vencimento:
            raise ValueError("'vencimento' é obrigatório para contas não recorrentes.")
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
