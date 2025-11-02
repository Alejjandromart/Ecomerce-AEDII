import axios from 'axios';
import { Product } from "../types/product";

const API_URL = 'http://localhost:3000';

// CRUD operations for Products
// buscar todos os produtos
export const buscarProdutos = async (): Promise<Product[]> => (await axios.get(`${API_URL}/products`)).data;

// Criar um novo produto
export const criarProduto = async (data: Omit<Product, 'id'>): Promise<Product> => (await axios.post('${API_URL}/products', data)).data;

// Atualizar um produto existente
export const atualizarProduto = async (id: string, data: Omit<Product, 'id'>): Promise<Product> => (await axios.put(`${API_URL}/products/${id}`, data)).data;

// Deletar um produto
export const deletarProduto = async (id: string): Promise<void> => (await axios.delete(`${API_URL}/products/${id}`));

// AVL Tree Visualization
export const buscarProdutosAVL = async (): Promise<string> => {
  try {
    const response = await axios.get(`${API_URL}/tree/visualize`);
    return response.data.mermaid_string || response.data;
  } catch (error) {
    console.error('Erro ao buscar visualização da árvore:', error);
    throw error;
  }
};

// Buscar stats
export const buscarStats = async (): Promise<object> => (await axios.get(`${API_URL}/stats`)).data;