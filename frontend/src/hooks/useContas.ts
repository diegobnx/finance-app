import { useEffect, useState } from "react";
import axios from "axios";
import { Conta, ContaCreate } from "../types/conta";

const BASE_URL = import.meta.env.VITE_API_URL || `${window.location.origin}/api/v1`;

/**
 * Validação mínima para descrição, valor (>0) e vencimento (quando não recorrente)
 */
function validarContaBasica(conta: Pick<Conta, "descricao" | "valor" | "recorrente" | "vencimento">): string | null {
  const valorNumero = Number(conta.valor);
  if (!conta.descricao.trim()) return "Descrição obrigatória.";
  if (isNaN(valorNumero) || valorNumero <= 0) return "Valor inválido.";
  if (!conta.recorrente && !conta.vencimento) return "Vencimento obrigatório para contas não recorrentes.";
  return null;
}


export function useContas() {
  const [contas, setContas] = useState<Conta[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Estado para armazenar a conta que está sendo editada
  const [contaEmEdicao, setContaEmEdicao] = useState<Conta | null>(null);

  const listar = async () => {
    setError(null);
    setLoading(true);
    try {
      const response = await axios.get<Conta[]>(`${BASE_URL}/contas`);
      setContas(response.data);
    } catch (err) {
      setError("Erro ao buscar contas.");
    } finally {
      setLoading(false);
    }
  };

  const criar = async (novaConta: ContaCreate) => {
    const erroValidacao = validarContaBasica({
      descricao: novaConta.descricao,
      valor: novaConta.valor,
      recorrente: novaConta.recorrente ?? false,
      vencimento: novaConta.vencimento ?? "",
    });
    if (erroValidacao) {
      setError(erroValidacao);
      return;
    }

    setError(null);
    try {
      const response = await axios.post<Conta>(`${BASE_URL}/contas`, novaConta);
      setContas(prev => [...prev, response.data]);
    } catch {
      setError("Erro ao criar conta.");
    }
  };

  const atualizar = async (id: string, conta: Conta) => {
    const erroValidacao = validarContaBasica({
      descricao: conta.descricao,
      valor: conta.valor,
      recorrente: conta.recorrente,
      vencimento: conta.vencimento,
    });
    if (erroValidacao) {
      setError(erroValidacao);
      return;
    }

    setError(null);
    try {
      const payload = {
        descricao: conta.descricao.trim(),
        valor: parseFloat(String(conta.valor)),
        vencimento: conta.vencimento,
        recorrente: conta.recorrente,
        inicio_periodo: conta.inicio_periodo || null,
        fim_periodo: conta.fim_periodo || null,
        status: conta.status,
      };

      const response = await axios.put<Conta>(`${BASE_URL}/contas/${id}`, payload);
      setContas(prev => prev.map(c => (c.id === id ? response.data : c)));
    } catch {
      setError("Erro ao atualizar conta.");
    }
  };

  const pagar = async (id: string) => {
    const conta = contas.find(c => c.id === id);
    if (!conta) {
      setError("Conta não encontrada.");
      return;
    }

    // Usa 'atualizar' reaproveitando a mesma lógica
    await atualizar(id, {
      ...conta,
      status: conta.status === "pago" ? "pendente" : "pago",
    } as Conta);
  };

  const deletar = async (id: string) => {
    try {
      setError(null);
      await axios.delete(`${BASE_URL}/contas/${id}`);
      setContas(prev => prev.filter(c => c.id !== id));
    } catch {
      setError("Erro ao deletar conta.");
    }
  };

  useEffect(() => {
    listar();
  }, []);

  // Retorna os dados e funções para manipulação das contas, incluindo a conta em edição
  return {
    contas,
    loading,
    error,
    listar,
    criar,
    atualizar,
    deletar,
    contaEmEdicao,
    setContaEmEdicao,
    pagar,
  };
}
