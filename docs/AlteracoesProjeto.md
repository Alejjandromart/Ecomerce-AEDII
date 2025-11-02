
# Histórico Detalhado de Alterações do Projeto Ecomerce-AEDII

Este documento detalha todas as principais alterações realizadas no projeto, incluindo decisões técnicas, arquivos modificados, motivos das mudanças e impactos no funcionamento do sistema.

---

## 1. Correção de Tipos no Formulário de Produto
- **Arquivo:** `src/components/ProductForm.tsx`
- **Alterações:**
	- Mudança do tipo do formulário para `Omit<Product, 'id'>`.
	- Adição de `valueAsNumber` nos campos `preco` e `quantidade`.
	- Tradução das mensagens de erro para português.
- **Motivo:** Evitar erro de TypeScript ao criar/editar produtos sem ID e garantir validação correta dos campos numéricos.
- **Impacto:** Formulário mais robusto, sem erros de tipagem e com feedback claro ao usuário.

## 2. Configuração do Tailwind CSS v4
- **Arquivos:** `tailwind.config.cjs`, `postcss.config.cjs`, `src/index.css`
- **Alterações:**
	- Criação manual dos arquivos de configuração devido falha do comando `npx tailwindcss init -p`.
	- Atualização do CSS para usar `@import "tailwindcss"`.
- **Motivo:** Adaptação à nova estrutura do Tailwind v4 e correção de problemas de inicialização.
- **Impacto:** Estilos funcionam corretamente e são atualizados conforme padrão moderno.

## 3. Navegação Multi-páginas
- **Arquivos:** `src/App.tsx`, `src/pages/Home.tsx`, `src/pages/ProdutosPage.tsx`, `src/pages/ArvorePage.tsx`, `src/pages/EstatisticasPage.tsx`
- **Alterações:**
	- Implementação do React Router com rotas para Home, Produtos, Árvore e Estatísticas.
	- Criação de layout inicial com cards de navegação.
- **Motivo:** Permitir navegação intuitiva entre diferentes funcionalidades do sistema.
- **Impacto:** Usuário pode acessar facilmente todas as telas principais.

## 4. Persistência Offline e Modo Híbrido
- **Arquivo:** `src/hooks/useProductStore.ts`
- **Alterações:**
	- Refatoração para usar localStorage em modo offline.
	- Leitura da variável de ambiente `VITE_MODE` para alternar entre online e offline.
- **Motivo:** Garantir funcionamento do sistema sem dependência do backend.
- **Impacto:** Usuário pode cadastrar, editar e excluir produtos mesmo sem conexão.

## 5. Visualização de Árvore AVL
- **Arquivo:** `src/components/TreeVisualization.tsx`
- **Alterações:**
	- Criação do componente que renderiza diagramas usando Mermaid.js.
	- Tratamento de erros e estado vazio.
- **Motivo:** Exibir visualmente a estrutura da árvore AVL para fins didáticos.
- **Impacto:** Facilita compreensão dos conceitos de estrutura de dados.

## 6. Página de Estatísticas AED II
- **Arquivo:** `src/pages/EstatisticasPage.tsx`
- **Alterações:**
	- Implementação de cálculos dinâmicos de altura, rotações e tabelas de complexidade.
	- Conteúdo explicativo sobre AVL, Big O, propriedades e exemplos.
- **Motivo:** Atender requisitos acadêmicos e enriquecer o aprendizado.
- **Impacto:** Página serve como material de apoio para estudo de algoritmos.

## 7. Remoção da Página Buscar
- **Arquivo:** `src/pages/BuscarPage.tsx`
- **Alterações:**
	- Remoção do arquivo e das referências no roteamento.
- **Motivo:** Busca já integrada na lista de produtos, tornando a página redundante.
- **Impacto:** Interface mais simples e objetiva.

## 8. Melhorias de UI/UX
- **Arquivos:** `src/components/ProductEditModal.tsx`, `src/components/ProductCard.tsx`, `src/components/ProductForm.tsx`
- **Alterações:**
	- Efeito de blur no fundo do modal.
	- Hover dos cards alterado para `-translate-y-1`.
	- Mensagens de erro e notificações em português.
- **Motivo:** Tornar a experiência mais agradável e acessível.
- **Impacto:** Interface mais moderna e intuitiva.

## 9. Importação em Lote de Produtos
- **Arquivos:** `src/utils/produtosExemplo.ts`, `src/components/ProductList.tsx`
- **Alterações:**
	- Criação de arquivo com 47 produtos de exemplo em 9 categorias.
	- Adição de botão "Carregar Exemplos" na interface.
	- Função com confirmação, feedback de progresso e notificação de sucesso.
- **Motivo:** Facilitar testes, demonstrações e visualização da árvore AVL.
- **Impacto:** Rapidez para popular o sistema e validar funcionalidades.

## 10. Outras Alterações Técnicas
- **Arquivos diversos:**
	- Ajustes em tipos, interfaces e validações.
	- Atualização de dependências no `package.json`.
	- Criação de `.env` para configuração do modo de operação.
	- Documentação e comentários explicativos em pontos críticos.
- **Motivo:** Garantir robustez, flexibilidade e facilidade de manutenção.
- **Impacto:** Projeto mais organizado, seguro e pronto para expansão.

---

**Última atualização:** 01/11/2025

---

Para detalhes linha a linha, consulte os arquivos citados ou solicite explicação específica sobre qualquer alteração.
