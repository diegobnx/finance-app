import { useContas } from "../hooks/useContas";
import { ContaItem } from "../components/ContaItem";
import { ContaForm } from "../components/ContaForm";

export default function Home() {
  const { contas, loading, error, criar, atualizar, deletar } = useContas();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Controle Financeiro</h1>

      <ContaForm onSubmit={criar} />

      {loading && <p>Carregando contas...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="mt-6 space-y-4">
        {contas.map((conta) => (
          <ContaItem
            key={conta._id}
            conta={conta}
            onUpdate={atualizar}
            onDelete={deletar}
          />
        ))}
      </div>
    </div>
  );
}
