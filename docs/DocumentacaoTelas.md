# Documentação das Telas do Sistema Ecomerce-AEDII

Este documento descreve o objetivo, funcionalidades e principais componentes de cada tela do sistema.

---

## Home (`src/pages/Home.tsx`)

**Descrição:**
Tela inicial do sistema, apresenta um dashboard com cards de navegação para as principais funcionalidades.

**Funcionalidades:**

- Apresenta visualmente as opções de navegação: Produtos, Árvore AVL, Estatísticas.
- Cada card possui ícone, título e breve descrição.
- Permite acesso rápido às demais telas.

**Componentes Principais:**

- Grid de cards de navegação
- Ícones ilustrativos

---

## Produtos (`src/pages/ProdutosPage.tsx`)

**Descrição:**
Tela de gerenciamento dos produtos cadastrados no sistema.

**Funcionalidades:**

- Listagem dos produtos com busca por nome ou categoria.
- Adição, edição e exclusão de produtos.
- Importação em lote de produtos de exemplo.
- Modal para cadastro/edição com validação de dados.
- Feedback visual via notificações (toast).

**Componentes Principais:**

- `ProductList`: lista, busca, botões de ação
- `ProductCard`: exibe dados de cada produto
- `ProductEditModal`: modal para cadastro/edição
- `ProductForm`: formulário validado

---

## Árvore AVL (`src/pages/ArvorePage.tsx`)

**Descrição:**
Tela dedicada à visualização da estrutura de dados AVL baseada nos produtos cadastrados.

**Funcionalidades:**

- Renderiza a árvore AVL dos produtos usando Mermaid.js.
- Exibe quantidade de produtos e estado da árvore.
- Permite visualizar como os produtos estão organizados na estrutura AVL.
- Mensagens de erro ou estado vazio caso não haja produtos.

**Componentes Principais:**

- `TreeVisualization`: renderização gráfica da árvore

---

## Estatísticas (`src/pages/EstatisticasPage.tsx`)

**Descrição:**
Tela educativa com informações sobre algoritmos, estrutura AVL e análise de complexidade.

**Funcionalidades:**

- Exibe estatísticas dinâmicas dos produtos e da árvore AVL (altura, rotações, etc).
- Tabelas de complexidade (Big O) e explicações teóricas.
- Conteúdo didático sobre propriedades, vantagens e limitações da AVL.
- Calcula e apresenta dados com base nos produtos cadastrados.

**Componentes Principais:**

- Tabelas e textos explicativos
- Cálculos dinâmicos com `useProductStore`

---

## Fluxo de Navegação

- O usuário inicia na Home e pode acessar qualquer funcionalidade principal.
- Todas as telas possuem navegação clara e feedback visual.
- O sistema foi projetado para ser intuitivo, educativo e funcional, atendendo tanto requisitos acadêmicos quanto usabilidade prática.

---

**Última atualização:** 01/11/2025
