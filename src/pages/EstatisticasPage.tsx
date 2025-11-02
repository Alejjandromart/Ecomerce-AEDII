import React, { useMemo } from "react"
import { Link } from "react-router-dom"
import { useProductStore } from "../hooks/useProductStore"

export const EstatisticasPage: React.FC = () => {
  const { products } = useProductStore()

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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Link 
          to="/" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Voltar para Home
        </Link>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            📊 Estatísticas do Sistema
          </h1>
          <p className="text-gray-600">
            Análise completa dos produtos e desempenho da árvore AVL
          </p>
        </div>

        {products.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Nenhum dado disponível
            </h2>
            <p className="text-gray-600 mb-6">
              Adicione produtos para visualizar as estatísticas
            </p>
            <Link 
              to="/produtos"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Adicionar Produtos
            </Link>
          </div>
        ) : (
          <>
            {/* Cards principais */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total de Produtos */}
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-600 text-sm font-medium">Total de Produtos</h3>
                  <span className="text-3xl">📦</span>
                </div>
                <p className="text-3xl font-bold text-gray-800">{stats.totalProdutos}</p>
                <p className="text-xs text-gray-500 mt-2">Cadastrados no sistema</p>
              </div>

              {/* Valor Total */}
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-600 text-sm font-medium">Valor Total</h3>
                  <span className="text-3xl">💰</span>
                </div>
                <p className="text-3xl font-bold text-green-600">
                  {formatPrice(stats.valorTotalEstoque)}
                </p>
                <p className="text-xs text-gray-500 mt-2">Estoque total</p>
              </div>

              {/* Itens em Estoque */}
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-600 text-sm font-medium">Itens em Estoque</h3>
                  <span className="text-3xl">📊</span>
                </div>
                <p className="text-3xl font-bold text-gray-800">{stats.quantidadeTotalItens}</p>
                <p className="text-xs text-gray-500 mt-2">Unidades disponíveis</p>
              </div>

              {/* Preço Médio */}
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-600 text-sm font-medium">Preço Médio</h3>
                  <span className="text-3xl">💵</span>
                </div>
                <p className="text-3xl font-bold text-gray-800">
                  {formatPrice(stats.precoMedio)}
                </p>
                <p className="text-xs text-gray-500 mt-2">Por produto</p>
              </div>
            </div>

            {/* Produtos Destaque */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Produto Mais Caro */}
              {stats.produtoMaisCaro && (
                <div className="bg-linear-to-br from-green-500 to-blue-800 rounded-xl shadow-lg p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">🏆 Produto Mais Caro</h3>
                  </div>
                  <p className="text-2xl font-bold mb-2">{stats.produtoMaisCaro.nome}</p>
                  <p className="text-3xl font-bold mb-2">
                    {formatPrice(stats.produtoMaisCaro.preco)}
                  </p>
                  <div className="flex items-center justify-between text-sm opacity-90">
                    <span>{stats.produtoMaisCaro.categoria}</span>
                    <span>{stats.produtoMaisCaro.quantidade} unidades</span>
                  </div>
                </div>
              )}

              {/* Produto Mais Barato */}
              {stats.produtoMaisBarato && (
                <div className="bg-linear-to-br from-red-500 to-blue-800 rounded-xl shadow-lg p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">💎 Produto Mais Barato</h3>
                  </div>
                  <p className="text-2xl font-bold mb-2">{stats.produtoMaisBarato.nome}</p>
                  <p className="text-3xl font-bold mb-2">
                    {formatPrice(stats.produtoMaisBarato.preco)}
                  </p>
                  <div className="flex items-center justify-between text-sm opacity-90">
                    <span>{stats.produtoMaisBarato.categoria}</span>
                    <span>{stats.produtoMaisBarato.quantidade} unidades</span>
                  </div>
                </div>
              )}
            </div>

            {/* Categorias e AVL */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Categorias */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="mr-2">🏷️</span>
                  Produtos por Categoria
                </h3>
                <div className="space-y-3">
                  {Object.entries(stats.categorias)
                    .sort(([, a], [, b]) => b.count - a.count)
                    .map(([categoria, data]) => (
                      <div key={categoria} className="border-l-4 border-blue-400 pl-4 py-2 bg-gray-50 rounded">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-gray-800">{categoria}</span>
                          <span className="text-sm text-gray-600">{data.count} produtos</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Valor total</span>
                          <span className="font-bold text-green-600">{formatPrice(data.valor)}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Informações da Árvore AVL */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="mr-2">🌳</span>
                  Árvore AVL - Desempenho
                </h3>
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-700 font-medium">Altura da Árvore</span>
                      <span className="text-2xl font-bold text-blue-600">{stats.alturaArvore}</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Níveis de profundidade para busca
                    </p>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-700 font-medium">Complexidade de Busca</span>
                      <span className="text-xl font-bold text-green-600">O(log n)</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Tempo logarítmico para operações
                    </p>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-700 font-medium">Operações Máximas</span>
                      <span className="text-xl font-bold text-purple-600">
                        ~{stats.alturaArvore * 2}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Para encontrar qualquer produto
                    </p>
                  </div>

                  <div className="bg-orange-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-700 font-medium">Balanceamento</span>
                      <span className="text-xl font-bold text-orange-600">Automático</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Mantém eficiência em inserções e remoções
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Alertas */}
            {stats.produtosSemEstoque > 0 && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-6 mb-8">
                <div className="flex items-start">
                  <span className="text-3xl mr-4">⚠️</span>
                  <div>
                    <h3 className="text-lg font-bold text-yellow-800 mb-2">
                      Atenção: Produtos sem estoque
                    </h3>
                    <p className="text-yellow-700">
                      Há <strong>{stats.produtosSemEstoque}</strong> produto(s) com quantidade zero. 
                      Considere reabastecer o estoque.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Informações Educacionais */}
            <div className="bg-linear-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">💡 Por que usar Árvore AVL?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="text-4xl mb-2">⚡</div>
                  <h4 className="font-bold mb-2">Busca Rápida</h4>
                  <p className="text-sm opacity-90">
                    Encontra produtos em tempo O(log n), muito mais rápido que busca linear O(n)
                  </p>
                </div>
                <div>
                  <div className="text-4xl mb-2">⚖️</div>
                  <h4 className="font-bold mb-2">Auto-Balanceamento</h4>
                  <p className="text-sm opacity-90">
                    Mantém a árvore balanceada automaticamente, garantindo desempenho ótimo
                  </p>
                </div>
                <div>
                  <div className="text-4xl mb-2">🎯</div>
                  <h4 className="font-bold mb-2">Eficiência Garantida</h4>
                  <p className="text-sm opacity-90">
                    Complexidade garantida para inserção, busca e remoção em qualquer cenário
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
