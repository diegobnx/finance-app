import React, { useEffect, useState } from "react";
import { Conta, ContaCreate } from "../types/conta";

interface Props {
  conta: Conta;
  onUpdate: (id: string, data: ContaCreate) => void;
  onDelete: (id: string) => void;
  onEdit?: (conta: Conta) => void;
}

export function ContaItem({ conta, onUpdate, onDelete, onEdit }: Props) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState<ContaCreate>({
    descricao: "",
    valor: "0",
    vencimento: "",
    recorrente: false,
    inicio_periodo: "",
    fim_periodo: "",
    status: "",
  });
  // garante um identificador mesmo se vier como _id do backend
  const idReal = (conta.id ?? (conta as any)._id) as string;

  const handleEdit = () => {
    setEditData({
      descricao: conta.descricao,
      valor: conta.valor.toString().replace('.', ','),
      vencimento: new Date(conta.vencimento).toISOString().split("T")[0],
      recorrente: conta.recorrente,
      inicio_periodo: conta.inicio_periodo,
      fim_periodo: conta.fim_periodo,
      status: conta.status,
    });
    setShowEditModal(true);
    if (onEdit) onEdit(conta);
  };

  const handleSave = async () => {
    if (
      !editData.descricao ||
      (editData.recorrente === false && !editData.vencimento) ||
      Number(editData.valor.replace(",", ".")) <= 0
    ) {
      console.error("Dados inválidos:", editData);
      return;
    }

    const payload: ContaCreate = {
      descricao: editData.descricao.trim(),
      valor: parseFloat(editData.valor.replace(/\./g, "").replace(",", ".")),
      vencimento: new Date(editData.vencimento).toISOString().split("T")[0],
      recorrente: editData.recorrente,
      status: editData.status || "pendente",
      inicio_periodo: editData.inicio_periodo ?? "",
      fim_periodo: editData.fim_periodo ?? "",
    };

    console.log("Enviando payload corrigido:", payload);

    try {
      await onUpdate(idReal, payload);
      setShowEditModal(false); // fecha o modal somente após sucesso
    } catch (e) {
      console.error("Falha ao atualizar conta:", e);
    }
  };

  useEffect(() => {
    if (showEditModal) {
      setEditData({
        descricao: conta.descricao,
        valor: conta.valor.toString().replace('.', ','),
        vencimento: new Date(conta.vencimento).toISOString().split("T")[0],
        recorrente: conta.recorrente,
        inicio_periodo: conta.inicio_periodo,
        fim_periodo: conta.fim_periodo,
        status: conta.status,
      });
    }
  }, [showEditModal, conta]);

  return (
    <div className="bg-white shadow p-4 rounded-md flex justify-between items-center">
      <div>
        <h2 className="text-lg font-semibold">{conta.descricao}</h2>
        <p className="text-gray-500">
          Vencimento:{" "}
          {conta.vencimento ? new Date(new Date(conta.vencimento).getTime() + 24 * 60 * 60 * 1000).toLocaleDateString() : "Sem vencimento"}
        </p>
        <p className="text-gray-800 font-bold">
          {conta.valor
            ? new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(Number(conta.valor))
            : "R$ 0,00"}
        </p>
        <p
          className={`inline-block px-2 py-1 text-sm rounded ${
            conta.status === "pago"
              ? "bg-green-100 text-green-800"
              : conta.status === "vencida"
              ? "bg-red-100 text-red-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {conta.status}
        </p>
      </div>
      <div className="space-x-2 flex">
        <button
          className={`${
            conta.status === "pago" ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-600 hover:bg-green-700"
          } text-white px-3 py-1 rounded`}
          onClick={async () => {
            const novoStatus = conta.status === "pago" ? "pendente" : "pago";
            try {
              await onUpdate(idReal, {
                descricao: conta.descricao,
                valor: conta.valor,
                vencimento: conta.vencimento,
                recorrente: conta.recorrente,
                inicio_periodo: conta.inicio_periodo ?? "",
                fim_periodo: conta.fim_periodo ?? "",
                status: novoStatus,
                quantidade_parcelas: conta.quantidade_parcelas ?? undefined,
                numero_parcela: conta.numero_parcela ?? undefined,
                total_parcelas: conta.total_parcelas ?? undefined,
                dia_vencimento: conta.dia_vencimento ?? undefined,
              });
            } catch (e) {
              console.error("Falha ao atualizar status da conta:", e);
            }
          }}
        >
          {conta.status === "pago" ? "Marcar como Pendente" : "Marcar como Pago"}
        </button>
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          onClick={handleEdit}
        >
          Editar
        </button>
        <button
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          onClick={() => onDelete(idReal)}
        >
          Excluir
        </button>
      </div>

      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-md w-96">
            <h2 className="text-lg font-semibold mb-4">Editar Conta</h2>
            <input
              type="text"
              value={editData.descricao}
              onChange={(e) => setEditData({ ...editData, descricao: e.target.value })}
              placeholder="Descrição"
              className="border p-2 w-full mb-2"
            />
            <input
              type="text"
              value={editData.valor}
              onChange={(e) => {
                let raw = e.target.value.replace(/[^\d]/g, "");
                let formatted = (Number(raw) / 100).toFixed(2).replace(".", ",");
                setEditData({ ...editData, valor: formatted });
              }}
              placeholder="Valor"
              className="border p-2 w-full mb-2"
            />
            <input
              type="date"
              value={editData.vencimento}
              onChange={(e) => setEditData({ ...editData, vencimento: e.target.value })}
              className="border p-2 w-full mb-2"
            />
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
              >
                Salvar
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 ml-2"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
