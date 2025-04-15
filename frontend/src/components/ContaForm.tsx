import { useState } from "react";
import { ContaCreate } from "../types/conta";

interface Props {
  onSubmit: (data: ContaCreate) => void;
}

export function ContaForm({ onSubmit }: Props) {
  const [form, setForm] = useState<ContaCreate>({
    descricao: "",
    valor: 0,
    vencimento: new Date().toISOString().split("T")[0],
    recorrente: false,
    inicio_periodo: "",
    fim_periodo: "",
    status: "pendente"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
    setForm({
      descricao: "",
      valor: 0,
      vencimento: new Date().toISOString().split("T")[0],
      recorrente: false,
      inicio_periodo: "",
      fim_periodo: "",
      status: "pendente"
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow p-4 rounded-md space-y-4">
      <div>
        <label className="block font-medium">Descrição</label>
        <input
          type="text"
          name="descricao"
          value={form.descricao}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block font-medium">Valor</label>
        <input
          type="number"
          name="valor"
          value={form.valor}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          step="0.01"
          required
        />
      </div>

      <div>
        <label className="block font-medium">Data de Vencimento</label>
        <input
          type="date"
          name="vencimento"
          value={form.vencimento}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="recorrente"
          checked={form.recorrente}
          onChange={handleChange}
        />
        <label className="font-medium">Recorrente</label>
      </div>

      {form.recorrente && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Início</label>
            <input
              type="month"
              name="inicio_periodo"
              value={form.inicio_periodo}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block font-medium">Fim</label>
            <input
              type="month"
              name="fim_periodo"
              value={form.fim_periodo}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>
      )}

      <button
        type="submit"
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Adicionar Conta
      </button>
    </form>
  );
}
