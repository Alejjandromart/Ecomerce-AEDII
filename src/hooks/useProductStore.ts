/**
 * Store Zustand para gerenciamento de produtos
 * Suporta modo online (API FastAPI) e offline (localStorage)
 * Adapta formatos entre frontend e backend automaticamente
 */

import { create } from 'zustand';
import { Product } from '../types/product';
import { toast } from 'react-hot-toast';
import axios from 'axios';

// Configuração de ambiente
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const MODE = import.meta.env.VITE_MODE || 'offline'; // 'offline' ou 'online'

// Chave para armazenar no localStorage
const STORAGE_KEY = 'ecommerce-produtos';

/**
 * Carrega produtos do localStorage
 * @returns Array de produtos ou array vazio se falhar
 */
const loadProductsFromStorage = (): Product[] => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Erro ao carregar produtos do localStorage:', error);
        return [];
    }
};

/**
 * Salva produtos no localStorage
 * @param products - Array de produtos a salvar
 */
const saveProductsToStorage = (products: Product[]): void => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch (error) {
        console.error('Erro ao salvar produtos no localStorage:', error);
    }
};

/**
 * Interface do estado da store de produtos
 */
interface ProductStoreState {
    // Estado
    products: Product[];
    isLoading: boolean;
    error: string | null;

    // Ações CRUD
    buscarProduto: () => Promise<void>;
    addProduto: (product: Product) => Promise<void>;
    atualizarProduto: (product: Product) => Promise<void>;
    deletarProduto: (id: string) => Promise<void>;
    clearAllProducts: () => void;

    // Configuração de estado
    setProducts: (products: Product[]) => void;
    setLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;
}

export const useProductStore = create<ProductStoreState>((set, get) => ({
    products: loadProductsFromStorage(),
    isLoading: false,
    error: null,

    /**
     * Busca todos os produtos do backend ou localStorage
     * Adapta formato backend {codigo, categoria[]} → frontend {id, categoria}
     */
    buscarProduto: async () => {
        set({ isLoading: true, error: null });
        try {
            if (MODE === 'online') {
                // Modo ONLINE: Busca do backend e adapta formato
                const response = await axios.get(`${API_BASE_URL}/produtos`);
                console.log('Produtos do backend:', response.data);
                
                // Adapta produtos do backend para formato do frontend
                const produtos = (response.data.produtos || []).map((p: any) => ({
                    id: String(p.codigo),
                    nome: p.nome,
                    preco: p.preco,
                    quantidade: p.quantidade,
                    categoria: Array.isArray(p.categoria) ? p.categoria[0] : p.categoria
                }));
                
                set({ products: produtos, error: null });
            } else {
                // Modo OFFLINE: Busca do localStorage
                await new Promise(resolve => setTimeout(resolve, 100));
                const products = loadProductsFromStorage();
                set({ products, error: null });
            }
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            // Em caso de erro, carrega do localStorage como fallback
            const products = loadProductsFromStorage();
            set({ 
                products, 
                error: null // Não mostra erro se conseguiu carregar do localStorage
            });
        } finally {
            set({ isLoading: false });
        }
    },

    /**
     * Adiciona novo produto ao catálogo
     * Adapta formato frontend {id, categoria} → backend {codigo, categoria[]}
     * @param product - Produto a ser adicionado
     */
    addProduto: async (product: Product) => {
        set({ isLoading: true });
        try {
            console.log('Adicionando produto:', product);
            console.log('Modo:', MODE);
            
            if (MODE === 'online') {
                // Modo ONLINE: Adapta e envia para o backend
                const backendProduct = {
                    codigo: parseInt(product.id) || Date.now(),
                    nome: product.nome,
                    preco: product.preco,
                    quantidade: product.quantidade,
                    categoria: [product.categoria] // Backend espera array
                };
                console.log('Enviando para backend:', backendProduct);
                
                const response = await axios.post(`${API_BASE_URL}/produtos`, backendProduct);
                console.log('Resposta do backend:', response.data);
                
                // Converte resposta do backend para formato do frontend
                const newProduct: Product = {
                    id: String(response.data.produto?.codigo || Date.now()),
                    nome: response.data.produto?.nome || product.nome,
                    preco: response.data.produto?.preco || product.preco,
                    quantidade: response.data.produto?.quantidade || product.quantidade,
                    categoria: response.data.produto?.categoria?.[0] || product.categoria
                };
                
                set(state => ({
                    products: [...state.products, newProduct],
                    error: null
                }));
            } else {
                // Modo OFFLINE: Salva no localStorage
                await new Promise(resolve => setTimeout(resolve, 50));
                const newProduct: Product = {
                    ...product,
                    id: product.id.toString().startsWith('temp-') 
                        ? String(Date.now()) 
                        : product.id
                };
                console.log('Novo produto gerado:', newProduct);
                const updatedProducts = [...get().products, newProduct];
                console.log('Total de produtos após adicionar:', updatedProducts.length);
                saveProductsToStorage(updatedProducts);
                set({ products: updatedProducts, error: null });
            }
            toast.success('✅ Produto adicionado com sucesso!');
        } catch (error) {
            console.error('Erro completo ao adicionar produto:', error);
            set({ error: 'Erro ao adicionar produto' });
            toast.error('❌ Erro ao adicionar produto');
        } finally {
            set({ isLoading: false });
        }
    },

    /**
     * Atualiza produto existente no catálogo
     * Adapta formato frontend → backend
     * @param product - Produto com dados atualizados
     */
    atualizarProduto: async (product: Product) => {
        set({ isLoading: true });
        try {
            if (MODE === 'online') {
                // Modo ONLINE: Adapta e envia para o backend
                const codigo = parseInt(product.id);
                const backendProduct = {
                    codigo: codigo,
                    nome: product.nome,
                    preco: product.preco,
                    quantidade: product.quantidade,
                    categoria: [product.categoria]
                };
                
                await axios.put(`${API_BASE_URL}/produtos/${codigo}`, backendProduct);
                set(state => ({
                    products: state.products.map(p => p.id === product.id ? product : p),
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

    /**
     * Remove produto do catálogo
     * @param id - ID do produto a ser removido
     */
    deletarProduto: async (id: string) => {
        set({ isLoading: true });
        try {
            if (MODE === 'online') {
                // Modo ONLINE: Deleta do backend
                const codigo = parseInt(id);
                await axios.delete(`${API_BASE_URL}/produtos/${codigo}`);
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

    /**
     * Define lista de produtos e salva no localStorage
     * @param products - Array de produtos
     */
    setProducts: (products: Product[]) => {
        saveProductsToStorage(products);
        set({ products });
    },
    
    /**
     * Define estado de loading
     * @param isLoading - Indica se há operação em andamento
     */
    setLoading: (isLoading: boolean) => set({ isLoading }),
    
    /**
     * Define mensagem de erro
     * @param error - Mensagem de erro ou null
     */
    setError: (error: string | null) => set({ error }),
    
    /**
     * Remove todos os produtos do catálogo
     * Limpa localStorage e estado da aplicação
     */
    clearAllProducts: () => {
        localStorage.removeItem(STORAGE_KEY);
        set({ products: [], error: null });
    },
}));