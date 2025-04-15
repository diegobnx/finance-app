import React, { useState } from "react";
import { Conta, ContaCreate } from "../types/conta";

interface Props {
  conta: Conta;
  onUpdate: (id: string, data: ContaCreate) => void;
  onDelete: (id: string) => void;
  onEdit: (conta: Conta) => void;
}

export function ContaItem({ conta, onUpdate, onDelete, onEdit }: Props) {
  const { id, descricao, valor, vencimento, status } = conta;
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState<ContaCreate>({
    descricao: "",
    valor: 0,
    vencimento: "",
    recorrente: false,
    inicio_periodo: "",
    fim_periodo: "",
    status: "",
  });

  const handleEdit = () => {
    setEditData({
      descricao: conta.descricao,
      valor: conta.valor,
      vencimento: new Date(conta.vencimento).toISOString().split("T")[0],
      recorrente: conta.recorrente,
      inicio_periodo: conta.inicio_periodo,
      fim_periodo: conta.fim_periodo,
      status: conta.status,
    });
    setShowEditModal(true);
  };

  const handleSave = () => {
    onUpdate(id, {
      descricao: editData.descricao,
      valor: Number(editData.valor),
      vencimento: editData.vencimento,
      recorrente: editData.recorrente,
      inicio_periodo: editData.inicio_periodo || "",
      fim_periodo: editData.fim_periodo || "",
      status: editData.status || "pendente",
    });
    setShowEditModal(false);
  };

  return (
    <div className="bg-white shadow p-4 rounded-md flex justify-between items-center">
      <div>
        <h2 className="text-lg font-semibold">{descricao}</h2>
        <p className="text-gray-500">Vencimento: {new Date(new Date(vencimento).getTime() + 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
        <p className="text-gray-800 font-bold">
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(Number(valor))}
        </p>
        <p
          className={`inline-block px-2 py-1 text-sm rounded ${
            status === "paga"
              ? "bg-green-100 text-green-800"
              : status === "vencida"
              ? "bg-red-100 text-red-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {status}
        </p>
      </div>
      <div className="space-x-2 flex">
        <button
          className={`${
            status === "paga" ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-600 hover:bg-green-700"
          } text-white px-3 py-1 rounded`}
          onClick={() =>
            onUpdate(id, {
              ...conta,
              status: status === "paga" ? "pendente" : "paga",
            })
          }
        >
          {status === "paga" ? "Marcar como Pendente" : "Marcar como Pago"}
        </button>
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          onClick={handleEdit}
        >
          Editar
        </button>
        <button
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          onClick={() => onDelete(id)}
        >
          Excluir
        </button>
      </div>

      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-md">
            <h2 className="text-lg font-semibold">Editar Conta</h2>
            <input
              type="text"
              value={editData.descricao}
              onChange={(e) => setEditData({ ...editData, descricao: e.target.value })}
              placeholder="Descrição"
              className="border p-2 w-full mb-2"
            />
            <input
              type="number"
              value={editData.valor}
              onChange={(e) => setEditData({ ...editData, valor: Number(e.target.value) })}
              placeholder="Valor"
              className="border p-2 w-full mb-2"
            />
            <input
              type="date"
              value={editData.vencimento}
              onChange={(e) => setEditData({ ...editData, vencimento: e.target.value })}
              className="border p-2 w-full mb-2"
            />
            <button onClick={handleSave} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
              Salvar
            </button>
            <button onClick={() => setShowEditModal(false)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 ml-2">
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
