import { useEffect, useState } from "react";
import axios from "axios";
import { Conta, ContaCreate } from "../types/conta";

const BASE_URL = import.meta.env.VITE_API_URL || `${window.location.origin}/api/v1`;
const API_URL = `${BASE_URL}/contas`;

export function useContas() {
  const [contas, setContas] = useState<Conta[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const listar = async () => {
    setLoading(true);
    try {
      const response = await axios.get<Conta[]>(API_URL);
      setContas(response.data);
    } catch (err) {
      setError("Erro ao buscar contas.");
    } finally {
      setLoading(false);
    }
  };

  const criar = async (novaConta: ContaCreate) => {
    try {
      const response = await axios.post<Conta>(API_URL, novaConta);
      setContas(prev => [...prev, response.data]);
    } catch {
      setError("Erro ao criar conta.");
    }
  };

  const atualizar = async (id: string, contaAtualizada: ContaCreate) => {
    try {
      const response = await axios.put<Conta>(`${API_URL}/${id}`, contaAtualizada);
      setContas(prev => prev.map(c => c._id === id ? response.data : c));
    } catch {
      setError("Erro ao atualizar conta.");
    }
  };

  const deletar = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setContas(prev => prev.filter(c => c._id !== id));
    } catch {
      setError("Erro ao deletar conta.");
    }
  };

  useEffect(() => {
    listar();
  }, []);

  return {
    contas,
    loading,
    error,
    listar,
    criar,
    atualizar,
    deletar
  };
}
