import React, { useState, useEffect } from 'react';
import { Product } from '../types/product';
import { useProductStore } from '../hooks/useProductStore';

interface ProductEditModalProps {
  product: Product | null;
  onSave: (product: Product) => void;
  onClose: () => void;
  isSubmitting: boolean;
}

const initialProductState: Product = {
  id: '',
  nome: '',
  preco: 0,
  categoria: '',
  quantidade: 0
};

const productCategories = [
  'Eletrônicos',
  'Roupas',
  'Alimentos',
  'Móveis',
  'Livros',
  'Brinquedos',
  'Beleza',
  'Esportes',
  'Outros'
];

const ProductEditModal: React.FC<ProductEditModalProps> = ({ 
  product, 
  onSave, 
  onClose,
  isSubmitting
}) => {
    const [formData, setFormData] = useState<Product>(initialProductState);

    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (product) {
        setFormData(product);
        } else {
            setFormData({
                ...initialProductState,
                id: `temp-${Date.now()}`,
        });
        }
    }, [product]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    let processedValue: string | number = value;
    
    if (type === 'number') {
      if (name === 'quantidade') {
        // Para quantidade, usar parseInt
        processedValue = value === '' ? 0 : parseInt(value) || 0;
      } else if (name === 'preco') {
        // Para preço, usar parseFloat
        processedValue = value === '' ? 0 : parseFloat(value) || 0;
      } else {
        processedValue = parseFloat(value) || 0;
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue,
    }));

    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };

const validateForm = (): boolean => {
    const nome = (formData.nome ?? '').toString().trim();
    const preco = Number(formData.preco);
    const quantidade = Number(formData.quantidade);
    const categoria = (formData.categoria ?? '').toString().trim();

    console.log('Validando:', { nome, preco, quantidade, categoria });

    const checks: Array<[string, string] | null> = [
        nome ? (nome.length < 3 ? ['nome', 'O nome deve conter ao menos 3 caracteres.'] : null) : ['nome', 'Nome do produto é obrigatório.'],
        (!isFinite(preco) || preco <= 0) ? ['preco', 'Informe um preço válido maior que zero.'] : (preco > 1_000_000 ? ['preco', 'Preço muito alto. Verifique o valor informado.'] : null),
        (!Number.isInteger(quantidade) || quantidade < 0) ? ['quantidade', 'A quantidade deve ser um número inteiro não negativo.'] : (quantidade > 1_000_000 ? ['quantidade', 'Quantidade muito alta. Verifique o valor informado.'] : null),
        (!categoria || categoria === '') ? ['categoria', 'A categoria é obrigatória.'] : 
          (categoria && !productCategories.includes(categoria)) ? ['categoria', 'Categoria inválida. Selecione uma opção válida.'] : null
    ];

    const errors = checks
        .filter((c): c is [string, string] => Boolean(c))
        .reduce<Record<string, string>>((acc, [key, msg]) => ({ ...acc, [key]: msg }), {});

    console.log('Erros encontrados:', errors);
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
};
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form data antes da validação:', formData);
    
    if (!validateForm()) {
      console.log('Erros de validação:', validationErrors);
      return;
    }
    
    console.log('Formulário válido, chamando onSave com:', formData);
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Modal header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              {product && product.id.toString().indexOf('temp-') !== 0 
                ? 'Editar Produto' 
                : 'Adicionar Produto'}
            </h2>
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-gray-700"
              aria-label="Fechar"
            >
            {isSubmitting ? (
                // mostra um spinner enquanto uma "nova atualização"/envio está em andamento
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
            ) : (
                // ícone de fechar padrão
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            )}
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Product name field */}
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Produto*
                </label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    validationErrors.nome ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={isSubmitting}
                />
                {validationErrors.nome && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.nome}</p>
                )}
              </div>

              <div>
                <label htmlFor="preco" className="block text-sm font-medium text-gray-700 mb-1">
                  Preço (R$)*
                </label>
                <input
                  type="number"
                  id="preco"
                  name="preco"
                  value={formData.preco}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className={`w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    validationErrors.preco ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={isSubmitting}
                />
                {validationErrors.preco && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.preco}</p>
                )}
              </div>

              <div>
                <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria
                </label>
                <select
                  id="categoria"
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    validationErrors.categoria ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={isSubmitting}
                >
                  <option value="">Selecione uma categoria</option>
                  {productCategories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {validationErrors.categoria && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.categoria}</p>
                )}
              </div>

              <div>
                <label htmlFor="quantidade" className="block text-sm font-medium text-gray-700 mb-1">
                  Quantidade*
                </label>
                <input
                  type="number"
                  id="quantidade"
                  name="quantidade"
                  value={formData.quantidade}
                  onChange={handleChange}
                  step="1"
                  min="0"
                  className={`w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    validationErrors.quantidade ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={isSubmitting}
                />
                {validationErrors.quantidade && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.quantidade}</p>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductEditModal;