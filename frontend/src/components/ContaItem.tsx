import React from "react";
import { Conta, ContaCreate } from "../types/conta";

interface Props {
  conta: Conta;
  onUpdate: (id: string, data: ContaCreate) => void;
  onDelete: (id: string) => void;
  onEdit: (conta: Conta) => void;
}

export function ContaItem({ conta, onUpdate, onDelete, onEdit }: Props) {
  const { id, descricao, valor, vencimento, status } = conta;

  const handleEdit = () => {
    console.log("Editando conta:", conta);
    onEdit(conta);
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
          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
          onClick={() =>
            onUpdate(id, {
              descricao,
              valor,
              vencimento,
              recorrente: conta.recorrente,
              inicio_periodo: conta.inicio_periodo,
              fim_periodo: conta.fim_periodo,
              status: "paga",
            })
          }
        >
          Marcar Pago
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
    </div>
  );
}
