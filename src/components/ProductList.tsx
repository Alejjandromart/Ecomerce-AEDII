import React, { useState, useEffect } from 'react';
import { useProductStore } from '../hooks/useProductStore';
import { Product } from '../types/product';
import ProductCard from './ProductCard';
import ProductEditModal from './ProductEditModal';
import { Toaster } from 'react-hot-toast';
import { produtosExemplo } from '../utils/produtosExemplo';
import toast from 'react-hot-toast';


const ProductList: React.FC = () => {
  // Access the global product store
  const { 
    products, 
    isLoading, 
    error, 
    buscarProduto, 
    addProduto, 
    atualizarProduto, 
    deletarProduto,
    clearAllProducts,
  } = useProductStore();
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showLoadModal, setShowLoadModal] = useState(false);

  useEffect(() => {
    buscarProduto();
  }, [buscarProduto]);


  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };


  const handleDelete = async (productId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      await deletarProduto(productId);
    }
  };


  const handleSaveEdit = async (updatedProduct: Product) => {
    setIsSubmitting(true);
    try {
      // Verifica se é produto novo (não existe na lista atual)
      const produtoExiste = products.some(p => p.id === updatedProduct.id);
      
      if (!produtoExiste) {
        // Produto novo - adiciona
        await addProduto(updatedProduct);
      } else {
        // Produto existente - atualiza
        await atualizarProduto(updatedProduct);
      }
      setIsEditModalOpen(false);
      setSelectedProduct(null);
    } catch (err) {
      console.error('Erro de: ', err);
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleCloseModal = () => {
    if (!isSubmitting) {
      setIsEditModalOpen(false);
      setSelectedProduct(null);
    }
  };

  const handleCarregarProdutosExemplo = async (quantidade: number) => {
    setShowLoadModal(false);
    
    const produtosParaCarregar = produtosExemplo.slice(0, quantidade);
    const toastId = toast.loading(`Carregando ${quantidade} produtos...`);
    
    try {
      let sucessos = 0;
      let erros = 0;
      // Gera códigos sequenciais baseados no timestamp inicial
      const baseTimestamp = Math.floor(Date.now());

      for (let i = 0; i < produtosParaCarregar.length; i++) {
        const produto = produtosParaCarregar[i];
        try {
          const produtoComId: Product = {
            ...produto,
            // Gera código sequencial inteiro: baseTimestamp + índice * 1000 para garantir ordem
            id: (baseTimestamp + (i * 1000)).toString()
          };
          await addProduto(produtoComId);
          sucessos++;
          
          // Pequeno delay para não sobrecarregar
          await new Promise(resolve => setTimeout(resolve, 50));
        } catch (error) {
          erros++;
          console.error('Erro ao adicionar produto:', produto.nome, error);
        }
      }

      toast.dismiss(toastId);
      
      if (erros === 0) {
        toast.success(`✅ ${sucessos} produtos carregados com sucesso!`);
      } else {
        toast.success(`✅ ${sucessos} produtos carregados (${erros} com erro)`);
      }
    } catch (error) {
      toast.dismiss(toastId);
      toast.error('❌ Erro ao carregar produtos de exemplo');
      console.error('Erro:', error);
    }
  };

  const handleLimparTodosProdutos = async () => {
    const confirmacao = window.confirm(
      `⚠️ Tem certeza que deseja remover TODOS os ${products.length} produtos?\n\n` +
      'Esta ação não pode ser desfeita!'
    );
    
    if (confirmacao) {
      const toastId = toast.loading('🗑️ Removendo todos os produtos...');
      try {
        await clearAllProducts();
        toast.success('🗑️ Todos os produtos foram removidos!', { id: toastId });
      } catch (error) {
        toast.error('❌ Erro ao remover produtos', { id: toastId });
      }
    }
  };


  const filteredProducts = products.filter(product => 
    product.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster position="top-right" />
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Lista de Produtos</h1>
          {products.length > 0 && (
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
              {products.length} {products.length === 1 ? 'produto' : 'produtos'}
            </span>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar produtos..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <button 
            onClick={() => setShowLoadModal(true)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition flex items-center justify-center whitespace-nowrap"
            title="Carregar produtos de exemplo para testar o sistema"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Carregar Exemplos
          </button>

          {products.length > 0 && (
            <button 
              onClick={handleLimparTodosProdutos}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition flex items-center justify-center whitespace-nowrap"
              title="Remover todos os produtos"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Limpar Todos
            </button>
          )}
          
          <button 
            onClick={() => {
              setSelectedProduct(null);
              setIsEditModalOpen(true);
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition flex items-center justify-center whitespace-nowrap"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Adicionar Produto
          </button>
        </div>
      </div>

      {isLoading && products.length === 0 ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 rounded-full border-4 border-t-blue-500 border-b-gray-200 border-l-gray-200 border-r-gray-200 animate-spin"></div>
            <p className="mt-4 text-gray-600">Carregando produtos...</p>
          </div>
        </div>
      ) : filteredProducts.length === 0 ? (

        <div className="bg-gray-50 rounded-lg p-8 text-center">
          {searchTerm ? (
            <>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Nenhum Produto Encontrado</h3>
              <p className="text-gray-500 mb-4">
                Não encontramos produtos correspondentes a "{searchTerm}".
              </p>
              <button 
                onClick={() => setSearchTerm('')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
              >
                Limpar Busca
              </button>
            </>
          ) : (
            <>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Nenhum Produto Cadastrado</h3>
              <p className="text-gray-500 mb-4">Você ainda não possui produtos cadastrados.</p>
              <button 
                onClick={() => {
                  setSelectedProduct(null);
                  setIsEditModalOpen(true);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
              >
                Adicionar Primeiro Produto
              </button>
            </>
          )}
        </div>
      ) : (
        // Product grid
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard 
              key={product.id}
              product={product}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {isLoading && products.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg px-4 py-2 flex items-center z-10">
          <div className="h-4 w-4 rounded-full border-2 border-t-blue-500 border-b-gray-200 border-l-gray-200 border-r-gray-200 animate-spin mr-2"></div>
          <span className="text-sm text-gray-700">Processando...</span>
        </div>
      )}

      {isEditModalOpen && (
        <ProductEditModal
          product={selectedProduct}
          onSave={handleSaveEdit}
          onClose={handleCloseModal}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Modal de seleção de quantidade */}
      {showLoadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Carregar Produtos de Exemplo</h2>
            <p className="text-gray-600 mb-6">
              Escolha quantos produtos deseja adicionar ao sistema:
            </p>
            
            <div className="space-y-3">
              <button
                onClick={() => handleCarregarProdutosExemplo(5)}
                className="w-full px-6 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition flex items-center justify-between group"
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="font-semibold">5 Produtos</span>
                </div>
                <span className="text-sm opacity-90">Teste rápido</span>
              </button>

              <button
                onClick={() => handleCarregarProdutosExemplo(10)}
                className="w-full px-6 py-4 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition flex items-center justify-between group"
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-semibold">10 Produtos</span>
                </div>
                <span className="text-sm opacity-90">Teste médio</span>
              </button>

              <button
                onClick={() => handleCarregarProdutosExemplo(23)}
                className="w-full px-6 py-4 bg-green-500 hover:bg-green-600 text-white rounded-lg transition flex items-center justify-between group"
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  <span className="font-semibold">23 Produtos</span>
                </div>
                <span className="text-sm opacity-90">Teste completo</span>
              </button>
            </div>

            <button
              onClick={() => setShowLoadModal(false)}
              className="w-full mt-4 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition font-medium"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;