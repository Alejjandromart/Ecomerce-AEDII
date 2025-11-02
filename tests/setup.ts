/**
 * Configuração dos Testes - Ecomerce-AEDII
 * 
 * Este arquivo configura o ambiente de testes.
 */

import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Estender matchers do jest-dom
expect.extend(matchers);

// Limpar após cada teste
afterEach(() => {
  cleanup();
  localStorage.clear();
});

// Mock do window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock do IntersectionObserver
(global as any).IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
};

// Mock do console para testes mais limpos
(global as any).console = {
  ...console,
  error: vi.fn(),
  warn: vi.fn(),
};
