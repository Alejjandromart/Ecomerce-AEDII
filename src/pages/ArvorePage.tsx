import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { TreeVisualization } from "../components/TreeVisualization"
import { useProductStore } from "../hooks/useProductStore"

export const ArvorePage: React.FC = () => {
  const { products } = useProductStore()
  const [treeString, setTreeString] = useState<string>("")

  // Gera um exemplo de árvore Mermaid baseado nos produtos
  useEffect(() => {
    if (products.length === 0) {
      setTreeString("")
      return
    }

    // Exemplo de estrutura de árvore Mermaid
    // Em produção, isso viria do backend
    const mermaidCode = `
graph TD
    Root["Raiz"]
    ${products.slice(0, 7).map((p, i) => `
    Node${i}["${p.nome}<br/>R$ ${p.preco.toFixed(2)}"]
    `).join('')}
    
    Root --> Node0
    Root --> Node1
    ${products.length > 2 ? 'Node0 --> Node2' : ''}
    ${products.length > 3 ? 'Node0 --> Node3' : ''}
    ${products.length > 4 ? 'Node1 --> Node4' : ''}
    ${products.length > 5 ? 'Node1 --> Node5' : ''}
    ${products.length > 6 ? 'Node2 --> Node6' : ''}
    
    style Root fill:#3b82f6,stroke:#1e40af,stroke-width:2px,color:#fff
    ${products.slice(0, 7).map((_, i) => `
    style Node${i} fill:#60a5fa,stroke:#2563eb,stroke-width:2px,color:#fff
    `).join('')}
    `

    setTreeString(mermaidCode)
  }, [products])

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <Link 
          to="/" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Voltar para Home
        </Link>
        
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                🌳 Visualização da Árvore AVL
              </h1>
              <p className="text-gray-600">
                Estrutura de dados balanceada dos produtos cadastrados
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total de produtos</p>
              <p className="text-3xl font-bold text-blue-600">{products.length}</p>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <div className="text-6xl mb-4">�</div>
              <p className="text-gray-700 font-medium mb-2">Nenhum produto cadastrado</p>
              <p className="text-sm text-gray-600 mb-4">
                Adicione produtos para visualizar a árvore AVL
              </p>
              <Link 
                to="/produtos"
                className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Adicionar Produtos
              </Link>
            </div>
          ) : (
            <TreeVisualization treeString={treeString} />
          )}
        </div>

        {/* Informações sobre a árvore AVL */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-4xl mb-2">⚖️</div>
            <h3 className="font-semibold text-gray-800 mb-1">Balanceamento</h3>
            <p className="text-sm text-gray-600">
              Árvore auto-balanceada para busca eficiente
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-4xl mb-2">⚡</div>
            <h3 className="font-semibold text-gray-800 mb-1">Complexidade</h3>
            <p className="text-sm text-gray-600">
              O(log n) para inserção, busca e remoção
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-4xl mb-2">🎯</div>
            <h3 className="font-semibold text-gray-800 mb-1">Altura</h3>
            <p className="text-sm text-gray-600">
              Altura máxima: {Math.ceil(Math.log2(products.length + 1))}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
