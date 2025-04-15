import { useState, useEffect } from "react";
import React from "react";
import { ContaCreate } from "../types/conta";
import { v4 as uuidv4 } from "uuid";

interface Props {
  onSubmit: (data: ContaCreate) => void;
  formData?: ContaCreate;
  isEditing?: boolean;
}

export function ContaForm({ onSubmit, formData, isEditing }: Props) {
  const [form, setForm] = useState<ContaCreate>(
    isEditing && formData
      ? formData
      : {
          descricao: "",
          valor: "0",
          vencimento: new Date().toISOString().split("T")[0],
          recorrente: false,
          inicio_periodo: "",
          fim_periodo: "",
          status: "pendente"
        }
  );

  React.useEffect(() => {
    if (isEditing && formData) {
      setForm(formData);
    }
  }, [formData, isEditing]);

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

    const contaParaEnviar = {
      ...form,
      valor: parseFloat(form.valor).toFixed(2),
    };
    if (!form.id) {
      contaParaEnviar.id = uuidv4();
    }

    onSubmit(contaParaEnviar);

    if (!isEditing) {
      setForm({
        descricao: "",
        valor: "0",
        vencimento: new Date().toISOString().split("T")[0],
        recorrente: false,
        inicio_periodo: "",
        fim_periodo: "",
        status: "pendente"
      });
    }
  };

  return (
    <form key={form.id || "novo"} onSubmit={handleSubmit} className="bg-white shadow p-4 rounded-md space-y-4">
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
          }).format(Number(form.valor || "0"))}
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

      <button
        type="submit"
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        {isEditing ? "Salvar Alterações" : "Adicionar Conta"}
      </button>
    </form>
  );
}
