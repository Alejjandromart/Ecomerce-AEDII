import React from "react"
import { Link } from "react-router-dom"

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">
          🛒 Sistema de E-commerce
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Gerenciamento de produtos com Árvore AVL
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card: Cadastrar Produtos */}
          <Link 
            to="/produtos"
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl p-6 shadow-lg transition-all transform hover:scale-105"
          >
            <div className="text-center">
              <div className="text-5xl mb-4">📦</div>
              <h2 className="text-2xl font-semibold mb-2">Produtos</h2>
              <p className="text-blue-100">Adicionar, editar, buscar e visualizar produtos</p>
            </div>
          </Link>

          {/* Card: Visualizar Árvore */}
          <Link 
            to="/arvore"
            className="bg-green-500 hover:bg-green-600 text-white rounded-xl p-6 shadow-lg transition-all transform hover:scale-105"
          >
            <div className="text-center">
              <div className="text-5xl mb-4">🌳</div>
              <h2 className="text-2xl font-semibold mb-2">Árvore AVL</h2>
              <p className="text-green-100">Visualizar estrutura de dados</p>
            </div>
          </Link>

          {/* Card: Estatísticas */}
          <Link 
            to="/estatisticas"
            className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl p-6 shadow-lg transition-all transform hover:scale-105"
          >
            <div className="text-center">
              <div className="text-5xl mb-4">📊</div>
              <h2 className="text-2xl font-semibold mb-2">Estatísticas</h2>
              <p className="text-orange-100">Análises e complexidade algorítmica</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
