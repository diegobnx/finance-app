import { useState, useEffect } from "react";
import React from "react";
import { Conta } from "../types/conta";
import { v4 as uuidv4 } from "uuid";

interface Props {
  onSubmit: (data: Conta) => void;
  formData?: Conta;
  isEditing?: boolean;
}

export function ContaForm({ onSubmit, formData, isEditing }: Props) {
  const [form, setForm] = useState<Conta>(
    isEditing && formData
      ? formData
      : {
          descricao: "",
          valor: "0",
          vencimento: new Date().toISOString().split("T")[0],
          recorrente: false,
          total_parcelas: undefined,
          status: "pendente",
          dia_vencimento: undefined,
          quantidade_parcelas: undefined,
          id: uuidv4()
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ---- Validação básica ----
    const valorNumero = Number(form.valor);
    if (!form.descricao.trim() || isNaN(valorNumero) || valorNumero <= 0) {
      console.error("Dados inválidos (descrição/valor):", form);
      return;
    }

    if (!form.recorrente && !form.vencimento) {
      console.error("Data de vencimento obrigatória para contas não recorrentes");
      return;
    }

    if (form.recorrente) {
      if (
        !form.total_parcelas ||
        form.total_parcelas < 1 ||
        !form.dia_vencimento ||
        form.dia_vencimento < 1 ||
        form.dia_vencimento > 31
      ) {
        console.error("Dados de recorrência inválidos", form);
        return;
      }
    }

    // ---- Montagem do payload ----
    const contaParaEnviar: Conta = {
      ...form,
      valor: valorNumero.toFixed(2),
      quantidade_parcelas: form.recorrente ? Number(form.total_parcelas) || 1 : undefined,
      dia_vencimento: form.recorrente ? Number(form.dia_vencimento) || 1 : undefined,
      total_parcelas: form.recorrente ? Number(form.total_parcelas) || 1 : undefined,
      vencimento: form.vencimento || new Date().toISOString().split("T")[0],
    };

    if (!isEditing) {
      contaParaEnviar.id = uuidv4();
    }

    try {
      const resultado = await onSubmit(contaParaEnviar);
      if (Array.isArray(resultado)) {
        console.log("Contas adicionadas:", resultado);
      } else {
        console.log("Conta adicionada/atualizada:", resultado);
      }
    } catch (err) {
      console.error("Falha ao submeter conta:", err);
      return;
    }

    // ---- Reset do formulário ----
    setForm({
      descricao: "",
      valor: "0",
      vencimento: new Date().toISOString().split("T")[0],
      recorrente: false,
      total_parcelas: undefined,
      status: "pendente",
      dia_vencimento: undefined,
      quantidade_parcelas: undefined,
      id: uuidv4(),
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
