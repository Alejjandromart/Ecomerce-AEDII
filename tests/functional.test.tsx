/**
 * Testes Funcionais - Ecomerce-AEDII
 * 
 * Este arquivo contém testes para validar as funcionalidades principais do sistema.
 * Execute com: npm run test
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useProductStore } from '../src/hooks/useProductStore';
import type { Product } from '../src/types/product';

describe('Testes Funcionais - Store de Produtos', () => {
  beforeEach(() => {
    // Limpar localStorage antes de cada teste
    localStorage.clear();
    const { result } = renderHook(() => useProductStore());
    act(() => {
      result.current.clearAllProducts();
    });
  });

  it('Deve adicionar um novo produto com sucesso', async () => {
    const { result } = renderHook(() => useProductStore());
    
    const produto: Product = {
      id: 'test-1',
      nome: 'Notebook Dell',
      preco: 3500,
      categoria: 'Eletrônicos',
      quantidade: 10
    };

    await act(async () => {
      await result.current.addProduto(produto);
    });

    expect(result.current.products).toHaveLength(1);
    expect(result.current.products[0].nome).toBe('Notebook Dell');
  });

  it('Deve atualizar um produto existente', async () => {
    const { result } = renderHook(() => useProductStore());
    
    const produto: Product = {
      id: 'test-1',
      nome: 'Notebook Dell',
      preco: 3500,
      categoria: 'Eletrônicos',
      quantidade: 10
    };

    await act(async () => {
      await result.current.addProduto(produto);
    });

    const produtoAtualizado: Product = {
      ...produto,
      nome: 'Notebook Dell Atualizado',
      preco: 4000
    };

    await act(async () => {
      await result.current.atualizarProduto(produtoAtualizado);
    });

    expect(result.current.products[0].nome).toBe('Notebook Dell Atualizado');
    expect(result.current.products[0].preco).toBe(4000);
  });

  it('Deve deletar um produto', async () => {
    const { result } = renderHook(() => useProductStore());
    
    const produto: Product = {
      id: 'test-1',
      nome: 'Notebook Dell',
      preco: 3500,
      categoria: 'Eletrônicos',
      quantidade: 10
    };

    await act(async () => {
      await result.current.addProduto(produto);
    });

    expect(result.current.products).toHaveLength(1);

    await act(async () => {
      await result.current.deletarProduto('test-1');
    });

    expect(result.current.products).toHaveLength(0);
  });

  it('Deve buscar produtos do store', async () => {
    const { result } = renderHook(() => useProductStore());
    
    const produto: Product = {
      id: 'test-1',
      nome: 'Notebook Dell',
      preco: 3500,
      categoria: 'Eletrônicos',
      quantidade: 10
    };

    await act(async () => {
      await result.current.addProduto(produto);
    });

    await act(async () => {
      await result.current.buscarProduto();
    });

    expect(result.current.products).toHaveLength(1);
    expect(result.current.products[0].nome).toBe('Notebook Dell');
  });
});

describe('Testes Funcionais - Busca e Filtros', () => {
  beforeEach(() => {
    localStorage.clear();
    const { result } = renderHook(() => useProductStore());
    act(() => {
      result.current.clearAllProducts();
    });
  });

  it('Deve filtrar produtos por nome', async () => {
    const { result } = renderHook(() => useProductStore());
    
    const produtos: Product[] = [
      { id: '1', nome: 'Notebook Dell', preco: 3500, categoria: 'Eletrônicos', quantidade: 10 },
      { id: '2', nome: 'Mouse Logitech', preco: 150, categoria: 'Periféricos', quantidade: 50 },
      { id: '3', nome: 'Notebook HP', preco: 3000, categoria: 'Eletrônicos', quantidade: 5 }
    ];

    for (const produto of produtos) {
      await act(async () => {
        await result.current.addProduto(produto);
      });
    }

    const filtered = result.current.products.filter(p => 
      p.nome.toLowerCase().includes('notebook')
    );

    expect(filtered).toHaveLength(2);
    expect(filtered[0].nome).toContain('Notebook');
  });

  it('Deve filtrar produtos por categoria', async () => {
    const { result } = renderHook(() => useProductStore());
    
    const produtos: Product[] = [
      { id: '1', nome: 'Notebook Dell', preco: 3500, categoria: 'Eletrônicos', quantidade: 10 },
      { id: '2', nome: 'Mouse Logitech', preco: 150, categoria: 'Periféricos', quantidade: 50 },
      { id: '3', nome: 'Teclado Mecânico', preco: 500, categoria: 'Periféricos', quantidade: 20 }
    ];

    for (const produto of produtos) {
      await act(async () => {
        await result.current.addProduto(produto);
      });
    }

    const filtered = result.current.products.filter(p => 
      p.categoria === 'Periféricos'
    );

    expect(filtered).toHaveLength(2);
  });
});

describe('Testes Funcionais - Persistência', () => {
  it('Deve salvar produtos no localStorage', async () => {
    const { result } = renderHook(() => useProductStore());
    
    const produto: Product = {
      id: 'test-1',
      nome: 'Teste Persistência',
      preco: 100,
      categoria: 'Teste',
      quantidade: 5
    };

    await act(async () => {
      await result.current.addProduto(produto);
    });

    const stored = localStorage.getItem('ecommerce-produtos');
    expect(stored).toBeTruthy();
    const products = JSON.parse(stored!);
    expect(products).toHaveLength(1);
    expect(products[0].nome).toBe('Teste Persistência');
  });

  it('Deve carregar produtos do localStorage', () => {
    const produtos: Product[] = [
      { id: '1', nome: 'Produto 1', preco: 100, categoria: 'Cat1', quantidade: 5 },
      { id: '2', nome: 'Produto 2', preco: 200, categoria: 'Cat2', quantidade: 10 }
    ];

    localStorage.setItem('ecommerce-produtos', JSON.stringify(produtos));

    const { result } = renderHook(() => useProductStore());
    
    expect(result.current.products).toHaveLength(2);
    expect(result.current.products[0].nome).toBe('Produto 1');
  });

  it('Deve limpar todos os produtos', async () => {
    const { result } = renderHook(() => useProductStore());
    
    const produto: Product = {
      id: 'test-1',
      nome: 'Teste',
      preco: 100,
      categoria: 'Teste',
      quantidade: 5
    };

    await act(async () => {
      await result.current.addProduto(produto);
    });

    expect(result.current.products).toHaveLength(1);

    act(() => {
      result.current.clearAllProducts();
    });

    expect(result.current.products).toHaveLength(0);
    expect(localStorage.getItem('ecommerce-produtos')).toBeNull();
  });
});
