import { create } from 'zustand';
import { Product } from '../types/product';
import { toast } from 'react-hot-toast';
import axios from 'axios';

// Configuração de ambiente
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const MODE = import.meta.env.VITE_MODE || 'offline'; // 'offline' ou 'online'

// Chave para armazenar no localStorage
const STORAGE_KEY = 'ecommerce-produtos';

// Helper para carregar produtos do localStorage
const loadProductsFromStorage = (): Product[] => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Erro ao carregar produtos do localStorage:', error);
        return [];
    }
};

// Helper para salvar produtos no localStorage
const saveProductsToStorage = (products: Product[]): void => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch (error) {
        console.error('Erro ao salvar produtos no localStorage:', error);
    }
};

interface ProductStoreState {
    //state
    products: Product[];
    isLoading: boolean;
    error: string | null;

    //actions
    buscarProduto: () => Promise<void>;
    addProduto: (product: Product) => Promise<void>;
    atualizarProduto: (product: Product) => Promise<void>;
    deletarProduto: (id: string) => Promise<void>;
    clearAllProducts: () => void;

    //configuração de estado inicial
    setProducts: (products: Product[]) => void;
    setLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;
}

export const useProductStore = create<ProductStoreState>((set, get) => ({
    products: loadProductsFromStorage(),
    isLoading: false,
    error: null,

    // Ações: Buscar Produtos
    buscarProduto: async () => {
        set({ isLoading: true });
        try {
            if (MODE === 'online') {
                // Modo ONLINE: Busca do backend
                const response = await axios.get<Product[]>(`${API_BASE_URL}/products`);
                set({ products: response.data, error: null });
            } else {
                // Modo OFFLINE: Busca do localStorage
                await new Promise(resolve => setTimeout(resolve, 300));
                const products = loadProductsFromStorage();
                set({ products, error: null });
            }
        } catch (error) {
            set({ error: 'Erro ao buscar produtos' });
            toast.error('Erro ao buscar produtos');
        } finally {
            set({ isLoading: false });
        }
    },

    // Ações: Adicionar Produtos
    addProduto: async (product: Product) => {
        set({ isLoading: true });
        try {
            if (MODE === 'online') {
                // Modo ONLINE: Envia para o backend
                const response = await axios.post<Product>(`${API_BASE_URL}/products`, product);
                set(state => ({
                    products: [...state.products, response.data],
                    error: null
                }));
            } else {
                // Modo OFFLINE: Salva no localStorage
                await new Promise(resolve => setTimeout(resolve, 300));
                const newProduct: Product = {
                    ...product,
                    id: product.id.toString().startsWith('temp-') 
                        ? String(Date.now()) 
                        : product.id
                };
                const updatedProducts = [...get().products, newProduct];
                saveProductsToStorage(updatedProducts);
                set({ products: updatedProducts, error: null });
            }
            toast.success('✅ Produto adicionado com sucesso!');
        } catch (error) {
            set({ error: 'Erro ao adicionar produto' });
            toast.error('❌ Erro ao adicionar produto');
        } finally {
            set({ isLoading: false });
        }
    },

    // Ações: Atualizar Produto
    atualizarProduto: async (product: Product) => {
        set({ isLoading: true });
        try {
            if (MODE === 'online') {
                // Modo ONLINE: Envia para o backend
                const response = await axios.put<Product>(`${API_BASE_URL}/products/${product.id}`, product);
                set(state => ({
                    products: state.products.map(p => p.id === product.id ? response.data : p),
                    error: null
                }));
            } else {
                // Modo OFFLINE: Atualiza no localStorage
                await new Promise(resolve => setTimeout(resolve, 300));
                const updatedProducts = get().products.map(p => 
                    p.id === product.id ? product : p
                );
                saveProductsToStorage(updatedProducts);
                set({ products: updatedProducts, error: null });
            }
            toast.success('✅ Produto atualizado com sucesso!');
        } catch (error) {
            set({ error: 'Erro ao atualizar produto' });
            toast.error('❌ Erro ao atualizar produto');
        } finally {
            set({ isLoading: false });
        }
    },

    // Ações: Deletar Produto
    deletarProduto: async (id: string) => {
        set({ isLoading: true });
        try {
            if (MODE === 'online') {
                // Modo ONLINE: Deleta do backend
                await axios.delete(`${API_BASE_URL}/products/${id}`);
                set(state => ({
                    products: state.products.filter(p => p.id !== id),
                    error: null
                }));
            } else {
                // Modo OFFLINE: Remove do localStorage
                await new Promise(resolve => setTimeout(resolve, 300));
                const updatedProducts = get().products.filter(p => p.id !== id);
                saveProductsToStorage(updatedProducts);
                set({ products: updatedProducts, error: null });
            }
            toast.success('🗑️ Produto removido com sucesso!');
        } catch (error) {
            set({ error: 'Erro ao deletar produto' });
            toast.error('❌ Erro ao deletar produto');
        } finally {
            set({ isLoading: false });
        }
    },

    // Setters
    setProducts: (products: Product[]) => {
        saveProductsToStorage(products);
        set({ products });
    },
    setLoading: (isLoading: boolean) => set({ isLoading }),
    setError: (error: string | null) => set({ error }),
    
    // Limpar todos os produtos (útil para testes)
    clearAllProducts: () => {
        localStorage.removeItem(STORAGE_KEY);
        set({ products: [], error: null });
    },
}));