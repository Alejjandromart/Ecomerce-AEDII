import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Product } from '../types/product';

const productSchema = z.object({
    nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
    preco: z.number({
        message: "Digite um preço válido (apenas números)",
    }).positive("O preço deve ser maior que zero"),
    categoria: z.string().min(1, "A categoria é obrigatória"),
    quantidade: z.number({
        message: "Digite uma quantidade válida (apenas números inteiros)",
    }).int("A quantidade deve ser um número inteiro").nonnegative("A quantidade não pode ser negativa"),
})

type ProductFormData = z.infer<typeof productSchema>;

type CreateProduct = Omit<Product, 'id'>

interface ProductFormProps {
    initialData?: CreateProduct
    onSubmit: (data: ProductFormData) => void
}

export const ProductForm: React.FC<ProductFormProps> = ({
    initialData,
    onSubmit
}) => {
    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting}
    } = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues: initialData || {
            nome: '',
            preco: 0,
            categoria: '',
            quantidade: 0,
        }
    });

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="
            w-full 
            max-w-md 
            mx-auto 
            p-6
            bg-white
            shadow-lg
            rounded-2xl
            border
            border-gray-200"
            >
        <h2 className="
            text-2xl
            font-semibold
            text-gray-800
            mb-4">
                {initialData ? 'Editar Produto' : 'Adicionar Produto'}
            </h2>

        {/*Nome*/}
        <div className="mb-4">
            <label className="
                block
                text-sm
                font-medium
                text-gray-700
                mb-1">
                    Nome
            </label>
            <input
                {...register('nome')}
                type="text"
                className={`
                    w-full
                    px-3
                    py-2
                    border
                    rounded-lg
                    focus:ring-2
                    focus:ring-blue-500
                    focus:outline-none
                    ${errors.nome ? 'border-red-500' : 'border-gray-300'}
                `}
                placeholder="Ex: Camiseta Azul" />
            {errors.nome && (
                <p className="text-red-500 text-sm mt-1">{errors.nome.message}</p>
            )}
        </div> 
        
        {/*Preço*/}
        <div className="mb-4"> 
            <label className="
                block
                text-sm
                font-medium
                text-gray-700
                mb-1">
                    Preço (R$)
            </label>
            <input
                {...register('preco', { valueAsNumber: true })}
                type="number"
                step= "0.01"
                className={`
                    w-full
                    px-3
                    py-2
                    border
                    rounded-lg
                    focus:ring-2
                    focus:ring-blue-500
                    focus:outline-none
                    ${errors.preco ? 'border-red-500' : 'border-gray-300'}
                `}
                placeholder="Ex: 69.90" />
            {errors.preco && (
                <p className="text-red-500 text-sm mt-1">{errors.preco.message}</p>
            )}
        </div>

        {/*Categoria*/}
        <div className="mb-4">
            <label className="
                block
                text-sm
                font-medium
                text-gray-700
                mb-1">
                    Categoria
            </label>
            <input
                {...register('categoria')}
                type="text"
                className={`
                    w-full
                    px-3
                    py-2
                    border
                    rounded-lg
                    focus:ring-2
                    focus:ring-blue-500
                    focus:outline-none
                    ${errors.categoria ? 'border-red-500' : 'border-gray-300'}
                `}
                placeholder="Ex: Roupas" />
            {errors.categoria && (
                <p className="text-red-500 text-sm mt-1">{errors.categoria.message}</p>
            )}
        </div>

        {/*Quantidade*/}
        <div className="mb-4">
            <label className="
                block
                text-sm
                font-medium
                text-gray-700
                mb-1">
                    Quantidade
            </label>
            <input
                {...register('quantidade', { valueAsNumber: true })}
                type="number"
                className={`
                    w-full
                    px-3
                    py-2
                    border
                    rounded-lg
                    focus:ring-2
                    focus:ring-blue-500
                    focus:outline-none
                    ${errors.quantidade ? 'border-red-500' : 'border-gray-300'}
                `}
                placeholder="Ex: 10" />
            {errors.quantidade && (
                <p className="text-red-500 text-sm mt-1">{errors.quantidade.message}</p>
            )}
        </div>

        {/*Botão*/}
        <button
            type="submit"
            disabled={isSubmitting}
            className={`
                mt-4
                w-full
                px-4
                py-2
                bg-blue-500
                text-white
                font-semibold
                rounded-lg
                focus:outline-none
                focus:ring-2
                focus:ring-blue-600
                focus:ring-opacity-50
                ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
            `}
        >
            {isSubmitting 
                ? 'Salvando...'
                : initialData
                ? 'Salvar Alterações'
                : 'Adicionar Produto'}
        </button>
       </form>
    );
}
