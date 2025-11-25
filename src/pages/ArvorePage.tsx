import React, { useState, useEffect, useMemo } from "react"
import { Link } from "react-router-dom"
import { TreeVisualization } from "../components/TreeVisualization"
import { useProductStore } from "../hooks/useProductStore"
import { buscarProdutosAVL } from "../services/api"
import toast from "react-hot-toast"

const MODE = import.meta.env.VITE_MODE || 'offline';

export const ArvorePage: React.FC = () => {
  const { products } = useProductStore()
  const [treeString, setTreeString] = useState<string>("")
  const [isLoadingTree, setIsLoadingTree] = useState(false)

  // Cálculos de estatísticas
  const stats = useMemo(() => {
    if (products.length === 0) {
      return {
        totalProdutos: 0,
        valorTotalEstoque: 0,
        quantidadeTotalItens: 0,
        precoMedio: 0,
        produtoMaisCaro: null,
        produtoMaisBarato: null,
        categorias: {},
        produtosSemEstoque: 0,
        alturaArvore: 0,
      }
    }

    const valorTotalEstoque = products.reduce((acc, p) => acc + (p.preco * p.quantidade), 0)
    const quantidadeTotalItens = products.reduce((acc, p) => acc + p.quantidade, 0)
    const precoMedio = products.reduce((acc, p) => acc + p.preco, 0) / products.length

    const produtoMaisCaro = products.reduce((max, p) => p.preco > max.preco ? p : max, products[0])
    const produtoMaisBarato = products.reduce((min, p) => p.preco < min.preco ? p : min, products[0])

    const produtosSemEstoque = products.filter(p => p.quantidade === 0).length

    // Agrupa por categoria
    const categorias = products.reduce((acc, p) => {
      const cat = p.categoria || 'Sem categoria'
      if (!acc[cat]) {
        acc[cat] = { count: 0, valor: 0 }
      }
      acc[cat].count++
      acc[cat].valor += p.preco * p.quantidade
      return acc
    }, {} as Record<string, { count: number, valor: number }>)

    // Calcula altura teórica da árvore AVL
    const alturaArvore = Math.ceil(Math.log2(products.length + 1))

    return {
      totalProdutos: products.length,
      valorTotalEstoque,
      quantidadeTotalItens,
      precoMedio,
      produtoMaisCaro,
      produtoMaisBarato,
      categorias,
      produtosSemEstoque,
      alturaArvore,
    }
  }, [products])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  // Carrega a árvore do backend ou gera exemplo local
  useEffect(() => {
    if (products.length === 0) {
      setTreeString("")
      return
    }

    const loadTree = async () => {
      if (MODE === 'online') {
        // Modo ONLINE: Busca árvore real do backend
        setIsLoadingTree(true)
        try {
          const mermaidString = await buscarProdutosAVL()
          setTreeString(mermaidString)
        } catch (error) {
          console.error('Erro ao carregar árvore do backend:', error)
          toast.error('Erro ao carregar árvore. Usando visualização local.')
          generateLocalTree()
        } finally {
          setIsLoadingTree(false)
        }
      } else {
        // Modo OFFLINE: Gera árvore exemplo local
        generateLocalTree()
      }
    }

    const generateLocalTree = () => {
      // Árvore simulada com formato melhorado
      const maxProducts = Math.min(15, products.length); // Aumentei para mostrar mais nós
      const displayProducts = products.slice(0, maxProducts);

      const nodes = displayProducts.map((p, i) => {
        const nome = p.nome.length > 15 ? p.nome.substring(0, 15) + '...' : p.nome;
        return `    Node${i}["${nome}<br/>R$ ${p.preco.toFixed(2)}"]`;
      }).join('\n');

      const styles = displayProducts.map((_, i) =>
        `    style Node${i} fill:#60a5fa,stroke:#2563eb,stroke-width:2px,color:#fff`
      ).join('\n');

      // Gera conexões simples para simular árvore binária
      const edges = [];
      for (let i = 0; i < maxProducts; i++) {
        const leftChild = 2 * i + 1;
        const rightChild = 2 * i + 2;
        if (leftChild < maxProducts) edges.push(`    Node${i} --> Node${leftChild}`);
        if (rightChild < maxProducts) edges.push(`    Node${i} --> Node${rightChild}`);
      }

      const mermaidCode = `graph TD
    ${nodes}
    
    ${edges.join('\n')}
    
    ${styles}`;

      setTreeString(mermaidCode);
    }

    loadTree()
  }, [products])

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              🌳 Árvore AVL & Estatísticas
            </h1>
            <p className="text-gray-600">
              Visualização estrutural e análise de dados do estoque
              {MODE === 'online' && <span className="ml-2 text-green-600 font-semibold text-xs bg-green-100 px-2 py-1 rounded-full">● Online</span>}
              {MODE === 'offline' && <span className="ml-2 text-gray-500 font-semibold text-xs bg-gray-200 px-2 py-1 rounded-full">● Offline</span>}
            </p>
          </div>

          {products.length === 0 && (
            <Link
              to="/produtos"
              className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
            >
              <span className="mr-2">➕</span> Adicionar Produtos
            </Link>
          )}
        </div>

        {products.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Nenhum dado disponível
            </h2>
            <p className="text-gray-600 mb-6">
              Adicione produtos para visualizar a árvore e as estatísticas
            </p>
            <Link
              to="/produtos"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Adicionar Produtos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Coluna da Esquerda: Árvore AVL (Ocupa 2/3) */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6 min-h-[500px]">
                <div className="flex items-center justify-between mb-4 border-b pb-4">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center">
                    <span className="mr-2">🌲</span> Visualização da Estrutura
                  </h2>
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {products.length} nós na árvore
                  </span>
                </div>

                {isLoadingTree ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-pulse flex flex-col items-center">
                      <div className="h-12 w-12 rounded-full border-4 border-t-blue-500 border-b-gray-200 border-l-gray-200 border-r-gray-200 animate-spin"></div>
                      <p className="mt-4 text-gray-600">Carregando estrutura...</p>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-auto">
                    <TreeVisualization treeString={treeString} />
                  </div>
                )}
              </div>

              {/* Informações Educacionais */}
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                <h3 className="text-lg font-bold mb-4 flex items-center">
                  <span className="mr-2">💡</span> Por que usar Árvore AVL?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                    <div className="text-2xl mb-2">⚡</div>
                    <h4 className="font-bold text-sm mb-1">Busca Rápida</h4>
                    <p className="text-xs opacity-90">O(log n) vs O(n) linear</p>
                  </div>
                  <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                    <div className="text-2xl mb-2">⚖️</div>
                    <h4 className="font-bold text-sm mb-1">Auto-Balanceamento</h4>
                    <p className="text-xs opacity-90">Garante eficiência constante</p>
                  </div>
                  <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                    <div className="text-2xl mb-2">🎯</div>
                    <h4 className="font-bold text-sm mb-1">Eficiência</h4>
                    <p className="text-xs opacity-90">Ótimo para grandes volumes</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Coluna da Direita: Estatísticas (Ocupa 1/3) */}
            <div className="space-y-6">
              {/* Cards Resumo */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl shadow p-4 border-l-4 border-blue-500">
                  <p className="text-xs text-gray-500 uppercase font-bold">Total Produtos</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.totalProdutos}</p>
                </div>
                <div className="bg-white rounded-xl shadow p-4 border-l-4 border-green-500">
                  <p className="text-xs text-gray-500 uppercase font-bold">Valor Total</p>
                  <p className="text-lg font-bold text-green-600 truncate" title={formatPrice(stats.valorTotalEstoque)}>
                    {formatPrice(stats.valorTotalEstoque)}
                  </p>
                </div>
                <div className="bg-white rounded-xl shadow p-4 border-l-4 border-purple-500">
                  <p className="text-xs text-gray-500 uppercase font-bold">Itens Estoque</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.quantidadeTotalItens}</p>
                </div>
                <div className="bg-white rounded-xl shadow p-4 border-l-4 border-orange-500">
                  <p className="text-xs text-gray-500 uppercase font-bold">Preço Médio</p>
                  <p className="text-lg font-bold text-gray-800 truncate">
                    {formatPrice(stats.precoMedio)}
                  </p>
                </div>
              </div>

              {/* Métricas da Árvore */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center border-b pb-2">
                  <span className="mr-2">📐</span> Métricas da Árvore
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Altura da Árvore</span>
                    <span className="font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      {stats.alturaArvore}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Complexidade</span>
                    <span className="font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                      O(log n)
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Nós Folha (Est.)</span>
                    <span className="font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                      ~{Math.ceil(stats.totalProdutos / 2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Categorias */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center border-b pb-2">
                  <span className="mr-2">🏷️</span> Categorias
                </h3>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  {Object.entries(stats.categorias)
                    .sort(([, a], [, b]) => b.count - a.count)
                    .map(([categoria, data]) => (
                      <div key={categoria} className="flex justify-between items-center text-sm p-2 hover:bg-gray-50 rounded transition">
                        <span className="font-medium text-gray-700 truncate max-w-[120px]" title={categoria}>
                          {categoria}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                            {data.count}
                          </span>
                          <span className="text-gray-500 text-xs">
                            {formatPrice(data.valor)}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Alertas */}
              {stats.produtosSemEstoque > 0 && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-4">
                  <div className="flex items-start">
                    <span className="text-xl mr-3">⚠️</span>
                    <div>
                      <h3 className="font-bold text-yellow-800 text-sm">
                        Estoque Baixo
                      </h3>
                      <p className="text-yellow-700 text-xs mt-1">
                        {stats.produtosSemEstoque} produto(s) com quantidade zero.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
