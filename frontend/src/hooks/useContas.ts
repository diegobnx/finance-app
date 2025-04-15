import { useEffect, useState } from "react";
import axios from "axios";
import { Conta, ContaCreate } from "../types/conta";

const BASE_URL = import.meta.env.VITE_API_URL || `${window.location.origin}/api/v1`;

export function useContas() {
  const [contas, setContas] = useState<Conta[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Estado para armazenar a conta que está sendo editada
  const [contaEmEdicao, setContaEmEdicao] = useState<Conta | null>(null);

  const listar = async () => {
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
    try {
      const response = await axios.post<Conta>(`${BASE_URL}/contas`, novaConta);
      setContas(prev => [...prev, response.data]);
    } catch {
      setError("Erro ao criar conta.");
    }
  };

  const atualizar = async (id: string, contaAtualizada: ContaCreate) => {
    try {
      const response = await axios.put<Conta>(`${BASE_URL}/contas/${id}`, contaAtualizada);
      setContas(prev => prev.map(c => c.id === id ? response.data : c));
    } catch {
      setError("Erro ao atualizar conta.");
    }
  };

  const pagar = async (id: string) => {
    try {
      const conta = contas.find(c => c.id === id);
      if (!conta) throw new Error("Conta não encontrada");

      const contaAtualizada = { ...conta, status: "pago" };
      const response = await axios.put<Conta>(`${BASE_URL}/contas/${id}`, contaAtualizada);
      setContas(prev => prev.map(c => c.id === id ? response.data : c));
    } catch {
      setError("Erro ao pagar conta.");
    }
  };

  const deletar = async (id: string) => {
    try {
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
