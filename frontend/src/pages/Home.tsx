import React, { useState } from "react";
import { useContas } from "../hooks/useContas";
import { ContaItem } from "../components/ContaItem";
import { ContaForm } from "../components/ContaForm";
import { Conta } from "../types/conta";

export default function Home() {
  const { contas, loading, error, criar, atualizar, deletar } = useContas();
  const [contaEditando, setContaEditando] = useState<Conta | null>(null);

  const handleSubmit = (dados: Conta) => {
    if (!dados.descricao || !dados.valor || !dados.vencimento || !dados.status) {
      console.error("Dados inválidos:", dados);
      return;
    }

    if (contaEditando && contaEditando.id === dados.id) {
      atualizar(contaEditando.id, dados);
    } else {
      criar(dados, () => {
        window.location.reload();
      });
    }

    setContaEditando(null);
  };

  const handleEdit = (conta: Conta) => {
    console.log("Editando conta:", conta); // Adicionado para depuração
    setContaEditando({ ...conta });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Controle Financeiro</h1>

      <ContaForm
        onSubmit={handleSubmit}
        contaInicial={contaEditando}
        onCancel={() => setContaEditando(null)}
      />

      {loading && <p>Carregando contas...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="mt-6 space-y-4">
        {contas.map((conta) => (
          <ContaItem
            key={conta.id}
            conta={conta}
            onUpdate={atualizar}
            onDelete={deletar}
            onEdit={() => handleEdit(conta)}
            onMarkAsPaid={() =>
              atualizar(conta.id, {
                ...conta,
                status: conta.status === "pago" ? "pendente" : "pago",
              })
            }
            buttonText={conta.status === "pago" ? "Marcar como pendente" : "Marcar como pago"}
          />
        ))}
      </div>
    </div>
  );
}
