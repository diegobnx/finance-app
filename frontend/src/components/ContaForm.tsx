import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Conta } from "../types/conta";

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
          status: "pendente",
          dia_vencimento: undefined,
          quantidade_parcelas: undefined,
          id: uuidv4(),
        }
  );
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (isEditing && formData) {
      setForm(formData);
    }
  }, [isEditing, formData]);

  // ----------------- handlers -----------------
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);

    let parcelasNumero: number | undefined = undefined;
    let diaNumero: number | undefined = undefined;

    if (form.recorrente) {
      parcelasNumero =
        form.quantidade_parcelas && Number(form.quantidade_parcelas) > 0
          ? Number(form.quantidade_parcelas)
          : 1;

      diaNumero = form.dia_vencimento
        ? Number(form.dia_vencimento)
        : undefined;
    }

    const valorNumero = parseFloat(String(form.valor).replace(",", "."));
    if (!form.descricao.trim() || isNaN(valorNumero) || valorNumero <= 0) {
      setErro("Preencha descrição e um valor maior que 0.");
      return;
    }

    if (!form.recorrente && !form.vencimento) {
      setErro("Para conta única, informe a data de vencimento.");
      return;
    }

    const payload: Conta = {
      ...form,
      valor: valorNumero,
      quantidade_parcelas: parcelasNumero,
      dia_vencimento: diaNumero,
      vencimento: form.recorrente ? undefined : form.vencimento,
    };

    if (!isEditing) payload.id = uuidv4();

    try {
      await onSubmit(payload);
    } catch (err) {
      console.error(err);
      setErro("Falha ao salvar conta. Tente novamente.");
      return;
    }

    // reset
    setForm({
      descricao: "",
      valor: "0",
      vencimento: new Date().toISOString().split("T")[0],
      recorrente: false,
      status: "pendente",
      dia_vencimento: undefined,
      quantidade_parcelas: undefined,
      id: uuidv4(),
    });
  };

  // --------------- JSX ---------------
  return (
    <form
      key={form.id || "novo"}
      onSubmit={handleSubmit}
      className="bg-white shadow p-4 rounded-md space-y-4"
    >
      {erro && (
        <p className="text-red-600 bg-red-50 border border-red-300 rounded px-3 py-2">
          {erro}
        </p>
      )}

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
            const numeros = e.target.value.replace(/\D/g, "");
            const numero = (
              parseInt(numeros || "0", 10) / 100
            ).toFixed(2);
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
          <label className="block font-medium">
            Parcelas (número de meses)
          </label>
          <input
            type="number"
            name="quantidade_parcelas"
            value={form.quantidade_parcelas || ""}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            min={1}
            required
          />
          <label className="block font-medium">
            Dia fixo do vencimento (1 a 31) — opcional
          </label>
          <input
            type="number"
            name="dia_vencimento"
            value={form.dia_vencimento || ""}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            min={1}
            max={31}
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
