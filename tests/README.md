# 🧪 Testes - Ecomerce-AEDII

Esta pasta contém todos os scripts de teste do projeto.

---

## 📁 Estrutura

```
tests/
├── functional.test.tsx     # Testes do Store (lógica de negócio)
├── performance.test.tsx    # Testes de desempenho e carga
├── setup.ts                # Configuração do ambiente de testes
├── e2e-manual.js           # Checklist para testes manuais E2E
└── README.md               # Este arquivo
```

> **Nota:** Os arquivos são `.tsx` para suportar JSX quando necessário.

---

## 🚀 Como Executar

### Todos os Testes
```bash
npm test
```

### Com Interface Visual
```bash
npm run test:ui
```

### Apenas Testes de Desempenho
```bash
npm run test:performance
```

### Com Relatório de Cobertura
```bash
npm run test:coverage
```

### Testes Manuais
```bash
npm run dev              # Terminal 1: Iniciar servidor
node tests/e2e-manual.js # Terminal 2: Executar checklist
```

---

## 📋 Descrição dos Arquivos

### `functional.test.tsx`
**Testa lógica de negócio do Store (Zustand):**
- ✅ Adicionar produtos
- ✅ Atualizar produtos
- ✅ Deletar produtos
- ✅ Buscar produtos
- ✅ Filtrar por nome e categoria
- ✅ Persistência no localStorage
- ✅ Limpar todos os produtos

> **Abordagem:** Usa `renderHook` para testar o store diretamente, sem componentes React complexos.

### `performance.test.tsx`
**Testa desempenho do sistema:**
- ⚡ Tempo de carregamento (< 5s para 47 produtos)
- ⚡ Velocidade de busca (< 500ms em 100 produtos)
- ⚡ Cálculo de estatísticas (< 1s)
- ⚡ Uso de memória no localStorage (< 5MB)
- ⚡ Teste de carga (100+ produtos)

### `setup.ts`
Configuração do ambiente de testes:
- Matchers do jest-dom
- Limpeza após cada teste
- Mocks (window.matchMedia, IntersectionObserver)
- Configuração do console

### `e2e-manual.js`
Checklist para validação manual:
- 📋 12 categorias de testes
- 📋 Validação visual e de UX
- 📋 Responsividade
- 📋 Fluxos completos

---

## 📊 Cobertura Esperada

| Arquivo | Tipo | Meta | Status |
|---------|------|------|--------|
| useProductStore | Store | >95% | ✅ |
| Lógica de Negócio | Geral | >80% | ✅ |

> **Nota:** Testes focam na lógica de negócio (store) ao invés de componentes React com JSX, garantindo melhor compatibilidade e menos problemas de dependências.

---

## 🔧 Troubleshooting

### Erro: "Cannot find module" ou conflito de dependências
```bash
npm install --legacy-peer-deps
```
**Motivo:** O projeto usa React 19, mas algumas bibliotecas de teste requerem React 18.

### Testes falhando por timeout
Aumente o timeout no teste:
```typescript
it('teste', async () => {}, { timeout: 10000 });
```

### localStorage não persiste
Verifique se `setup.ts` está sendo executado e use `clearAllProducts()` antes de cada teste.

---

## 📚 Documentação Relacionada

- [Guia de Execução](../docs/GuiaExecucaoTestes.md)
- [Estratégias de Teste](../docs/TestesEstrategiasUso.md)
- [Exemplos Práticos](../docs/ExemplosPraticosTestes.md)

---

**Para mais informações, consulte a documentação completa em `/docs`.**
