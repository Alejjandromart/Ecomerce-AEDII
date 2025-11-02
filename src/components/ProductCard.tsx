import React from 'react';
import { useProductStore } from '../hooks/useProductStore';
import { Product } from '../types/product';

interface ProductCardProps {
    product: Product;
    onEdit: (product: Product) => void;
    onDelete: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
    product,
    onEdit,
    onDelete
}) => {
    const formattedPrice = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'

    }).format(product.preco);
    return (
        <div className="
            bg-white
            rounded-lg
            shadow-md
            overflow-hidden
            border
            border-gray-200
            transition-all
            duration-200
            hover:shadow-xl
            hover:-translate-y-0.9">
            <div className="p-5">
                <h3 className="
                    font-semibold
                    text-lg
                    text-gray-800
                    mb-2
                    truncate">{product.nome}</h3>
                <div className="
                    text-gray-600
                    flex
                    items-center
                    justify-between
                    mb-4">
                    <span className="
                        px-2
                        py-1
                        bg-blue-50
                        text-blue-600
                        text-xs
                        rounded-full">{product.categoria}   </span>
                </div>

                <div className="
                    flex
                    justify-between
                    items-center
                    mb-4">
                        <span className="
                            font-bold
                            text-blue-600
                            text-lg">{formattedPrice}</span>
                            <div className="flex items-center space-x-2">
                                <span className={`text-sm ${product.quantidade > 0 ? 'text-green-600' : 'text-red-400'}`}>
                                    {product.quantidade > 0 ? 'Em estoque' : 'Fora de estoque'}
                                </span>
                            </div>
                    </div>
                    
        <div className="flex justify-between mt-3">
          <button 
            onClick={() => onEdit(product)}
            className="flex-1 mr-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors text-sm font-medium"
            aria-label={`Editar ${product.nome}`}
          >
            Editar
          </button>
          <button 
            onClick={() => onDelete(product.id)}
            className="flex-1 ml-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-md transition-colors text-sm font-medium"
            aria-label={`Excluir ${product.nome}`}
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;