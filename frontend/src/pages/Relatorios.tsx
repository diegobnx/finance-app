import React, { useEffect, useState } from "react";
import React from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import { Conta } from "../types/conta";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export default function Relatorios() {
  const [contas, setContas] = useState<Conta[]>([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/contas`)
      .then(res => setContas(res.data))
      .catch(err => console.error("Erro ao buscar contas:", err));
  }, []);

  // Agrupamento por categoria
  const categoriasMap: { [key: string]: number } = {};
  contas.forEach(conta => {
    categoriasMap[conta.descricao] = (categoriasMap[conta.descricao] || 0) + Number(conta.valor);
  });

  const pieData = {
    labels: Object.keys(categoriasMap),
    datasets: [
      {
        label: "Despesas",
        data: Object.values(categoriasMap),
        backgroundColor: ["#f87171", "#60a5fa", "#fbbf24", "#34d399", "#a78bfa"],
      },
    ],
  };

  // Agrupamento por mês
  const mesesMap: { [key: string]: number } = {};
  contas.forEach(conta => {
    const mes = new Date(conta.vencimento).toLocaleString("pt-BR", { month: "short" });
    mesesMap[mes] = (mesesMap[mes] || 0) + Number(conta.valor);
  });

  const barData = {
    labels: Object.keys(mesesMap),
    datasets: [
      {
        label: "Total Gasto",
        data: Object.values(mesesMap),
        backgroundColor: "#60a5fa",
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Totais por Mês" },
    },
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📊 Relatórios</h2>
      <p className="text-gray-700 mb-6">
        Aqui você verá visualizações dos seus gastos, recorrências e totais mensais.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded shadow p-4">
          <h3 className="text-lg font-semibold mb-2">Distribuição de Gastos</h3>
          <Pie data={pieData} />
        </div>
        <div className="bg-white rounded shadow p-4">
          <h3 className="text-lg font-semibold mb-2">Totais Mensais</h3>
          <Bar data={barData} options={barOptions} />
        </div>
      </div>
    </div>
  );
}
