import React from "react";
import { Link, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">💰 FinanceApp</h1>
          <nav className="space-x-4">
            <Link to="/" className="text-gray-700 hover:text-blue-600">
              Início
            </Link>
            <Link to="/relatorios" className="text-gray-700 hover:text-blue-600">
              Relatórios
            </Link>
            <Link to="/configuracoes" className="text-gray-700 hover:text-blue-600">
              Configurações
            </Link>
          </nav>
        </div>
      </header>
      <main className="py-8 px-4 max-w-6xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
