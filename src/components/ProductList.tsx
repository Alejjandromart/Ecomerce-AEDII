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
  } = useProductStore();
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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
      // If it's a new product (temp id)
      if (updatedProduct.id.toString().indexOf('temp-') === 0) {
        await addProduto(updatedProduct);
      } else {
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

  const handleCarregarProdutosExemplo = async () => {
    const confirmacao = window.confirm(
      `Deseja carregar ${produtosExemplo.length} produtos de exemplo?\n\n` +
      'Isso adicionará produtos em várias categorias para testar o sistema.'
    );
    
    if (!confirmacao) return;

    const toastId = toast.loading(`Carregando ${produtosExemplo.length} produtos...`);
    
    try {
      let sucessos = 0;
      let erros = 0;

      for (const produto of produtosExemplo) {
        try {
          const produtoComId: Product = {
            ...produto,
            id: `exemplo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
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


  const filteredProducts = products.filter(product => 
    product.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error && !isLoading && products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
          <h3 className="text-lg font-medium text-red-800 mb-2">Erro ao Carregar Produtos</h3>
          <p className="text-red-700">{error}</p>
          <button 
            onClick={() => buscarProduto()} 
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Toaster position="top-right" />
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Lista de Produtos</h1>
        
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
            onClick={handleCarregarProdutosExemplo}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition flex items-center justify-center"
            title="Carregar 47 produtos de exemplo para testar o sistema"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Carregar Exemplos
          </button>
          
          <button 
            onClick={() => {
              setSelectedProduct(null);
              setIsEditModalOpen(true);
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition flex items-center justify-center"
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
    </div>
  );
};

export default ProductList;