# Guia de Execução dos Testes - Ecomerce-AEDII

Este documento explica como executar os diferentes tipos de testes disponíveis no projeto.

---

## Instalação das Dependências de Teste

Antes de executar os testes, instale as dependências necessárias:

```bash
npm install
```

**IMPORTANTE:** Se encontrar erro de conflito de dependências do React, use:

```bash
npm install --save-dev --legacy-peer-deps vitest @vitest/ui @vitest/coverage-v8 @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @types/node
```

> **Nota:** O projeto usa React 19, mas algumas bibliotecas de teste ainda requerem React 18. A flag `--legacy-peer-deps` resolve esse conflito.

---

## Tipos de Testes Disponíveis

### 1. Testes Unitários e de Integração

Execute todos os testes automatizados:

```bash
npm test
```

Execute com interface visual:

```bash
npm run test:ui
```

Execute com relatório de cobertura:

```bash
npm run test:coverage
```

### 2. Testes de Desempenho

Execute apenas os testes de desempenho:

```bash
npm run test:performance
```

### 3. Testes Manuais E2E (End-to-End)

Para testes manuais, primeiro inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Em outro terminal, execute o script de checklist:

```bash
node tests/e2e-manual.js
```

Siga o checklist exibido no console para testar manualmente cada funcionalidade.

---

## Estrutura dos Testes

### `tests/functional.test.tsx`
**Testa funcionalidades do Store (Zustand):**
- ✅ Adicionar produtos
- ✅ Atualizar produtos existentes
- ✅ Deletar produtos
- ✅ Buscar produtos
- ✅ Filtrar por nome e categoria
- ✅ Persistência no localStorage
- ✅ Limpar todos os produtos (para testes)

> **Nota:** Testes focam na lógica de negócio do store, não em componentes React com JSX.

### `tests/performance.test.tsx`
**Testa desempenho do sistema:**
- ⚡ Carregamento de 47 produtos (< 5s)
- ⚡ Busca em 100 produtos (< 500ms)
- ⚡ Cálculo de estatísticas (< 1s)
- ⚡ Uso de memória no localStorage
- ⚡ Teste de carga com 100+ produtos

### `tests/setup.ts`
**Configuração do ambiente:**
- Matchers do jest-dom
- Limpeza automática após testes
- Mocks (matchMedia, IntersectionObserver)

### `tests/e2e-manual.js`
**Checklist para testes manuais:**
- 12 categorias de testes
- Navegação e fluxos
- Interface e UX
- Responsividade
- Validações visuais

---

## Interpretando os Resultados

### ✅ Testes Passando
Todos os testes devem passar. Se algum falhar, verifique:
- Estado inicial dos dados (limpar localStorage)
- Dependências instaladas corretamente
- Servidor de desenvolvimento rodando (se necessário)

### 📊 Cobertura de Código
A cobertura ideal é acima de 80%. Relatório gerado em `coverage/index.html`.

### ⚡ Desempenho
Benchmarks esperados:
- Carregamento de 47 produtos: < 5 segundos
- Busca em 100 produtos: < 500ms
- Cálculo de estatísticas: < 1 segundo
- Uso de memória: < 5MB no localStorage
- Cálculos de estatísticas: < 200ms

---

## Troubleshooting

### Erro: "Cannot find module 'vitest'"
```bash
npm install --save-dev vitest
```

### Erro: "ERESOLVE unable to resolve dependency tree" (React 19 vs 18)
```bash
npm install --save-dev --legacy-peer-deps vitest @vitest/ui @testing-library/react jsdom
```
**Motivo:** O projeto usa React 19, mas algumas bibliotecas de teste ainda requerem React 18.

### Erro: "jsdom not found"
```bash
npm install --save-dev jsdom
```

### Erro de tipagem TypeScript nos testes
Os arquivos de teste devem ter extensão `.tsx` (não `.ts`) para suportar JSX se necessário.

### Testes falhando por timeout
Aumente o timeout no arquivo de teste:
```typescript
it('meu teste', async () => {
  // código
}, { timeout: 10000 }); // 10 segundos
```

### localStorage não persiste entre testes
Verifique se o `setup.ts` está configurado corretamente e sendo executado. Use `clearAllProducts()` do store antes de cada teste.

---

## Boas Práticas

1. **Execute testes frequentemente** durante o desenvolvimento
2. **Escreva novos testes** ao adicionar funcionalidades
3. **Mantenha cobertura alta** (>80%)
4. **Documente casos de teste** complexos
5. **Use testes manuais** para validações visuais e de UX

---

**Última atualização:** 01/11/2025
