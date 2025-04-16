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
          total_parcelas: undefined,
          status: "pendente",
          dia_vencimento: undefined
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

    const contaParaEnviar: any = {
      descricao: form.descricao,
      valor: parseFloat(form.valor).toFixed(2),
      vencimento: form.vencimento,
      recorrente: form.recorrente,
      total_parcelas: form.total_parcelas || null,
      status: form.status,
      dia_vencimento: form.dia_vencimento || null
    };

    if (!isEditing) {
      contaParaEnviar.id = uuidv4();
    }

    onSubmit(contaParaEnviar);

    setForm({
      descricao: "",
      valor: "0",
      vencimento: new Date().toISOString().split("T")[0],
      recorrente: false,
      total_parcelas: undefined,
      status: "pendente",
      dia_vencimento: undefined
    });
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

      {!form.recorrente && (
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
      )}

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
        <div>
          <label className="block font-medium">Parcelas (número de meses)</label>
          <input
            type="number"
            name="total_parcelas"
            value={form.total_parcelas || ""}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            min={1}
            required
          />
          <label className="block font-medium">Dia fixo do vencimento (1 a 31)</label>
          <input
            type="number"
            name="dia_vencimento"
            value={form.dia_vencimento || ""}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            min={1}
            max={31}
            required
          />
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
