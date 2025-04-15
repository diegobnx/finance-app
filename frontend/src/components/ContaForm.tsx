import { useState } from "react";
import React from "react";
import { ContaCreate } from "../types/conta";

interface Props {
  onSubmit: (data: ContaCreate) => void;
}

export function ContaForm({ onSubmit }: Props) {
  const [form, setForm] = useState<ContaCreate>({
    descricao: "",
    valor: "0",
    vencimento: new Date().toISOString().split("T")[0],
    recorrente: false,
    inicio_periodo: "",
    fim_periodo: "",
    status: "pendente"
  });

  const formatarMoeda = (valor: string) => {
    const numerico = valor.replace(/\D/g, "");
    const numero = (parseInt(numerico || "0", 10) / 100).toFixed(2);
    return {
      exibicao: new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(Number(numero)),
      valorNumerico: numero
    };
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...form,
      valor: parseFloat(form.valor).toFixed(2)
    });
    setForm({
      descricao: "",
      valor: "0",
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
          type="text"
          name="valor"
          value={new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(Number(form.valor))}
          onChange={(e) => {
            const valorNumerico = e.target.value.replace(/\D/g, "");
            const numero = (parseInt(valorNumerico || "0", 10) / 100).toFixed(2);
            setForm((prev) => ({ ...prev, valor: numero }));
          }}
          className="w-full border rounded px-3 py-2"
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

      <div>
        <label className="block font-medium">Status</label>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        >
          <option value="pendente">Pendente</option>
          <option value="pago">Pago</option>
        </select>
      </div>

      <button
        type="button"
        onClick={() => setForm((prev) => ({ ...prev, status: "pago" }))}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Marcar como Pago
      </button>

      <button
        type="submit"
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Adicionar Conta
      </button>
    </form>
  );
}
