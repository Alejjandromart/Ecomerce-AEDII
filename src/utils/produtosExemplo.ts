import { Product } from '../types/product';

/**
 * Lista de produtos de exemplo para popular o sistema
 */
export const produtosExemplo: Omit<Product, 'id'>[] = [
  // Eletrônicos
  { nome: 'Notebook Dell Inspiron', preco: 3499.90, categoria: 'Eletrônicos', quantidade: 15 },
  { nome: 'Mouse Logitech MX Master', preco: 349.90, categoria: 'Eletrônicos', quantidade: 45 },
  { nome: 'Teclado Mecânico Redragon', preco: 289.90, categoria: 'Eletrônicos', quantidade: 30 },
  { nome: 'Monitor LG 27 polegadas', preco: 1299.90, categoria: 'Eletrônicos', quantidade: 12 },
  { nome: 'Webcam Logitech C920', preco: 449.90, categoria: 'Eletrônicos', quantidade: 25 },
  { nome: 'Fone de Ouvido Sony WH-1000XM4', preco: 1599.90, categoria: 'Eletrônicos', quantidade: 18 },
  { nome: 'SSD Samsung 1TB', preco: 499.90, categoria: 'Eletrônicos', quantidade: 50 },
  { nome: 'Pendrive 64GB Kingston', preco: 39.90, categoria: 'Eletrônicos', quantidade: 100 },
  
  // Roupas
  { nome: 'Camiseta Básica Preta', preco: 49.90, categoria: 'Roupas', quantidade: 80 },
  { nome: 'Calça Jeans Masculina', preco: 129.90, categoria: 'Roupas', quantidade: 45 },
  { nome: 'Tênis Nike Air Max', preco: 599.90, categoria: 'Roupas', quantidade: 30 },
  { nome: 'Jaqueta de Couro', preco: 399.90, categoria: 'Roupas', quantidade: 20 },
  { nome: 'Vestido Floral Feminino', preco: 159.90, categoria: 'Roupas', quantidade: 35 },
  { nome: 'Moletom com Capuz', preco: 119.90, categoria: 'Roupas', quantidade: 55 },
  
  // Alimentos
  { nome: 'Café Especial 250g', preco: 24.90, categoria: 'Alimentos', quantidade: 120 },
  { nome: 'Chocolate Lindt 100g', preco: 18.90, categoria: 'Alimentos', quantidade: 150 },
  { nome: 'Azeite Extra Virgem 500ml', preco: 34.90, categoria: 'Alimentos', quantidade: 80 },
  { nome: 'Mel Orgânico 300g', preco: 29.90, categoria: 'Alimentos', quantidade: 60 },
  { nome: 'Biscoito Integral', preco: 12.90, categoria: 'Alimentos', quantidade: 200 },
  
  // Móveis
  { nome: 'Cadeira Gamer DXRacer', preco: 1499.90, categoria: 'Móveis', quantidade: 10 },
  { nome: 'Mesa de Escritório', preco: 899.90, categoria: 'Móveis', quantidade: 15 },
  { nome: 'Estante para Livros', preco: 349.90, categoria: 'Móveis', quantidade: 12 },
  { nome: 'Poltrona Reclinável', preco: 799.90, categoria: 'Móveis', quantidade: 8 },
  
  // Livros
  { nome: 'Algoritmos - Cormen', preco: 189.90, categoria: 'Livros', quantidade: 25 },
  { nome: 'Clean Code - Robert Martin', preco: 79.90, categoria: 'Livros', quantidade: 40 },
  { nome: 'Design Patterns GoF', preco: 99.90, categoria: 'Livros', quantidade: 30 },
  { nome: 'Estruturas de Dados em C', preco: 69.90, categoria: 'Livros', quantidade: 35 },
  { nome: 'Python para Análise de Dados', preco: 89.90, categoria: 'Livros', quantidade: 28 },
  
  // Brinquedos
  { nome: 'LEGO Star Wars', preco: 299.90, categoria: 'Brinquedos', quantidade: 20 },
  { nome: 'Boneca Barbie', preco: 89.90, categoria: 'Brinquedos', quantidade: 45 },
  { nome: 'Carrinho Hot Wheels Kit 5', preco: 49.90, categoria: 'Brinquedos', quantidade: 60 },
  { nome: 'Quebra-Cabeça 1000 peças', preco: 59.90, categoria: 'Brinquedos', quantidade: 35 },
  
  // Beleza
  { nome: 'Perfume Importado 100ml', preco: 249.90, categoria: 'Beleza', quantidade: 40 },
  { nome: 'Kit Maquiagem Completo', preco: 179.90, categoria: 'Beleza', quantidade: 30 },
  { nome: 'Creme Hidratante Facial', preco: 89.90, categoria: 'Beleza', quantidade: 55 },
  { nome: 'Shampoo e Condicionador Kit', preco: 69.90, categoria: 'Beleza', quantidade: 70 },
  
  // Esportes
  { nome: 'Bola de Futebol Nike', preco: 149.90, categoria: 'Esportes', quantidade: 40 },
  { nome: 'Raquete de Tênis Wilson', preco: 399.90, categoria: 'Esportes', quantidade: 15 },
  { nome: 'Bicicleta Mountain Bike', preco: 1899.90, categoria: 'Esportes', quantidade: 8 },
  { nome: 'Halteres 5kg (par)', preco: 89.90, categoria: 'Esportes', quantidade: 50 },
  { nome: 'Tapete de Yoga', preco: 79.90, categoria: 'Esportes', quantidade: 45 },
  
  // Outros
  { nome: 'Mochila Executiva', preco: 199.90, categoria: 'Outros', quantidade: 35 },
  { nome: 'Garrafa Térmica 1L', preco: 69.90, categoria: 'Outros', quantidade: 60 },
  { nome: 'Guarda-Chuva Automático', preco: 49.90, categoria: 'Outros', quantidade: 80 },
  { nome: 'Relógio Digital Casio', preco: 299.90, categoria: 'Outros', quantidade: 25 },
];

/**
 * Gera produtos com IDs únicos
 */
export const gerarProdutosComIds = (): Product[] => {
  return produtosExemplo.map((produto, index) => ({
    ...produto,
    id: `produto-${Date.now()}-${index}`
  }));
};
