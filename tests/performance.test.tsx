/**
 * Testes de Desempenho - Ecomerce-AEDII
 * 
 * Este arquivo contém testes para validar o desempenho do sistema com grandes volumes de dados.
 * Execute com: npm run test:performance
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useProductStore } from '../src/hooks/useProductStore';
import { produtosExemplo } from '../src/utils/produtosExemplo';
import type { Product } from '../src/types/product';

describe('Testes de Desempenho', () => {
  beforeEach(() => {
    localStorage.clear();
    const { result } = renderHook(() => useProductStore());
    act(() => {
      result.current.clearAllProducts();
    });
  });

  it('Deve carregar 47 produtos em menos de 5 segundos', async () => {
    const { result } = renderHook(() => useProductStore());
    const startTime = performance.now();

    for (let i = 0; i < produtosExemplo.length; i++) {
      const produto: Product = {
        ...produtosExemplo[i],
        id: `perf-test-${i}`
      };
      await act(async () => {
        await result.current.addProduto(produto);
      });
    }

    const endTime = performance.now();
    const duration = endTime - startTime;

    console.log(`Tempo para carregar 47 produtos: ${duration.toFixed(2)}ms`);
    expect(duration).toBeLessThan(5000);
    expect(result.current.products).toHaveLength(47);
  });

  it('Deve buscar produtos em menos de 500ms', async () => {
    const { result } = renderHook(() => useProductStore());

    // Adicionar 100 produtos
    for (let i = 0; i < 100; i++) {
      const produto: Product = {
        id: `perf-${i}`,
        nome: `Produto ${i}`,
        preco: 100 + i,
        categoria: `Categoria ${i % 5}`,
        quantidade: 10
      };
      await act(async () => {
        await result.current.addProduto(produto);
      });
    }

    const startTime = performance.now();
    
    // Buscar produtos
    const filtered = result.current.products.filter(p => 
      p.nome.toLowerCase().includes('produto 5')
    );

    const endTime = performance.now();
    const duration = endTime - startTime;

    console.log(`Tempo de busca em 100 produtos: ${duration.toFixed(2)}ms`);
    expect(duration).toBeLessThan(500);
    expect(filtered.length).toBeGreaterThan(0);
  });

  it('Deve calcular estatísticas em menos de 1 segundo', async () => {
    const { result } = renderHook(() => useProductStore());

    // Adicionar produtos
    for (let i = 0; i < 50; i++) {
      const produto: Product = {
        id: `stats-${i}`,
        nome: `Produto ${i}`,
        preco: 100 + i,
        categoria: `Categoria ${i % 5}`,
        quantidade: 10
      };
      await act(async () => {
        await result.current.addProduto(produto);
      });
    }

    const startTime = performance.now();

    // Cálculos de estatísticas (simulando a página)
    const totalProdutos = result.current.products.length;
    const alturaAVL = Math.ceil(Math.log2(totalProdutos + 1));
    const rotacoesEstimadas = Math.floor(totalProdutos * 0.44);
    const categorias = [...new Set(result.current.products.map(p => p.categoria))];

    const endTime = performance.now();
    const duration = endTime - startTime;

    console.log(`Tempo de cálculo de estatísticas: ${duration.toFixed(2)}ms`);
    expect(duration).toBeLessThan(1000);
    expect(alturaAVL).toBeGreaterThan(0);
    expect(rotacoesEstimadas).toBeGreaterThan(0);
    expect(categorias.length).toBeGreaterThan(0);
  });

  it('Deve medir uso de memória localStorage', async () => {
    const { result } = renderHook(() => useProductStore());

    // Adicionar muitos produtos
    for (let i = 0; i < 200; i++) {
      const produto: Product = {
        id: `mem-${i}`,
        nome: `Produto de teste com nome longo para simular dados reais ${i}`,
        preco: 100 + i,
        categoria: `Categoria ${i % 10}`,
        quantidade: 10 + (i % 50)
      };
      await act(async () => {
        await result.current.addProduto(produto);
      });
    }

    const stored = localStorage.getItem('ecommerce-produtos');
    const sizeInBytes = new Blob([stored || '']).size;
    const sizeInKB = sizeInBytes / 1024;

    console.log(`Tamanho no localStorage: ${sizeInKB.toFixed(2)} KB`);
    
    // localStorage geralmente suporta 5-10MB
    expect(sizeInKB).toBeLessThan(5000); // 5MB
    expect(result.current.products).toHaveLength(200);
  });
});

describe('Testes de Carga', () => {
  it('Deve suportar adição de múltiplos produtos', async () => {
    const { result } = renderHook(() => useProductStore());
    let erros = 0;

    const startTime = performance.now();

    for (let i = 0; i < 100; i++) {
      try {
        const produto: Product = {
          id: `load-${i}`,
          nome: `Produto ${i}`,
          preco: 100 + i,
          categoria: `Categoria ${i % 10}`,
          quantidade: 10
        };
        await act(async () => {
          await result.current.addProduto(produto);
        });
      } catch (error) {
        erros++;
      }
    }

    const endTime = performance.now();
    const duration = endTime - startTime;

    console.log(`Tempo para adicionar 100 produtos: ${duration.toFixed(2)}ms`);
    console.log(`Erros: ${erros}`);
    
    expect(erros).toBe(0);
    expect(duration).toBeLessThan(30000); // 30 segundos
    expect(result.current.products).toHaveLength(100);
  });
});
