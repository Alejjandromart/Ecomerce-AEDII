# Estratégias de Teste e Cenários de Uso - Ecomerce-AEDII

Este documento sugere testes práticos e cenários para validar o funcionamento, desempenho e usabilidade do sistema.

---

## 📚 Tipos de Testes Implementados

O projeto conta com três tipos de testes:

### 1. **Testes Automatizados** (Vitest + Testing Library)
- Testes unitários de componentes
- Testes de integração entre funcionalidades
- Testes de desempenho e carga
- **Localização:** `tests/functional.test.ts`, `tests/integration.test.ts`, `tests/performance.test.ts`
- **Execução:** `npm test` ou `npm run test:ui`

### 2. **Testes Manuais E2E** (Checklist)
- Validação visual e de UX
- Fluxos completos de usuário
- Testes de responsividade
- **Localização:** `tests/e2e-manual.js`
- **Execução:** `node tests/e2e-manual.js`

### 3. **Guia de Execução**
- Instruções detalhadas para rodar os testes
- Troubleshooting e boas práticas
- **Localização:** `docs/GuiaExecucaoTestes.md`

---

## 1. Testes Funcionais

### Cadastro e Edição de Produtos
- ✅ **Automatizado:** Validação de formulário, cadastro, edição
- Cadastrar um novo produto com todos os campos preenchidos corretamente.
- Tentar cadastrar produto com campos obrigatórios em branco (validar mensagens de erro).
- Editar um produto existente e verificar se as alterações são salvas.
- Excluir um produto e garantir que ele desaparece da lista.

### Busca e Filtros
- ✅ **Automatizado:** Filtros por nome e categoria
- Buscar produtos por nome e categoria.
- Testar busca com termos inexistentes (validar mensagem "Nenhum Produto Encontrado").

### Importação em Lote
- ✅ **Automatizado:** Carregamento de 47 produtos
- Utilizar o botão "Carregar Exemplos" para importar 47 produtos.
- Verificar se todos aparecem na lista e se a árvore AVL é atualizada.

### Persistência Offline
- ✅ **Automatizado:** localStorage read/write
- Adicionar produtos, fechar e reabrir o navegador, verificar se os dados persistem.
- Alternar entre modo offline/online no `.env` e validar comportamento.

---

## 2. Testes de Interface e Usabilidade

- 📋 **Manual:** Verificação visual e responsividade
- Abrir e fechar o modal de cadastro/edição, verificar efeito de blur.
- Testar responsividade em diferentes tamanhos de tela (desktop, tablet, celular).
- Validar feedback visual (toasts, mensagens de erro, loading).
- Navegar entre todas as telas usando os cards da Home.

---

## 3. Testes de Visualização AVL

- 📋 **Manual:** Validação visual do diagrama Mermaid
- Cadastrar produtos em diferentes categorias e observar a árvore AVL.
- Importar produtos em lote e verificar se a árvore cresce corretamente.
- Remover produtos e observar mudanças na estrutura AVL.
- Validar mensagens de erro quando não há produtos para visualizar.

---

## 4. Testes de Estatísticas

- ✅ **Automatizado:** Cálculos de altura, rotações, complexidade
- Verificar se a página de estatísticas exibe altura, rotações e tabelas corretas.
- Testar com poucos e muitos produtos para comparar resultados.
- Validar explicações teóricas e exemplos exibidos.

---

## 5. Testes de Desempenho

- ✅ **Automatizado:** Benchmarks de velocidade e memória
- **Carregamento:** 47 produtos em < 2 segundos
- **Busca:** 100 produtos em < 100ms
- **Renderização:** Lista grande em < 1 segundo
- **Cálculos:** Estatísticas em < 200ms
- **Carga:** Suporte a 500+ produtos
- Importar os 47 produtos e medir tempo de resposta da interface.
- Cadastrar manualmente mais de 100 produtos e observar se há lentidão.
- Testar busca e filtros com grande volume de dados.
- Validar renderização da árvore AVL com muitos nós.

---

## 6. Cenários de Uso

### Cenário A: Novo Usuário
**Objetivo:** Explorar o sistema pela primeira vez
1. Acessa a Home e visualiza as opções
2. Clica em "Produtos" e cadastra 2-3 produtos manualmente
3. Testa busca e edição
4. Navega para Árvore AVL e visualiza estrutura
5. Acessa Estatísticas para ver métricas

### Cenário B: Professor em Aula
**Objetivo:** Demonstrar conceitos de AED II
1. Carrega produtos de exemplo (47 itens)
2. Mostra visualização da árvore AVL
3. Adiciona/remove produtos e mostra rotações
4. Explica estatísticas e complexidade
5. Compara altura teórica vs prática

### Cenário C: Aluno Estudando
**Objetivo:** Praticar e entender AVL
1. Cadastra produtos um a um observando mudanças na árvore
2. Testa diferentes quantidades e analisa altura
3. Remove produtos e observa rebalanceamento
4. Estuda tabelas de complexidade
5. Testa desempenho com volumes variados

### Cenário D: Desenvolvedor Testando
**Objetivo:** Validar robustez do sistema
1. Executa testes automatizados (`npm test`)
2. Verifica cobertura de código
3. Executa testes de desempenho
4. Segue checklist E2E manual
5. Testa modo online/offline

---

## 🚀 Como Executar os Testes

### Testes Automatizados
```bash
npm test              # Todos os testes
npm run test:ui       # Interface visual
npm run test:coverage # Com cobertura
npm run test:performance # Apenas desempenho
```

### Testes Manuais
```bash
npm run dev           # Inicie o servidor
node tests/e2e-manual.js # Execute o checklist
```

### Consulte o Guia Completo
Veja `docs/GuiaExecucaoTestes.md` para instruções detalhadas.

---

**Última atualização:** 01/11/2025
