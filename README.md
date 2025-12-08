# E-commerce AED II - Catálogo de Produtos com Árvore AVL

Este projeto é uma aplicação web interativa desenvolvida para a disciplina de **Algoritmos e Estrutura de Dados II** da **UFAM (Universidade Federal do Amazonas)**.

O objetivo principal é demonstrar a aplicação prática, eficiência e o funcionamento interno de uma **Árvore AVL (Adelson-Velsky and Landis)** no gerenciamento de um catálogo de produtos de e-commerce, oferecendo uma comparação direta de desempenho com estruturas lineares tradicionais.

## Funcionalidades

### 1. Catálogo de Produtos

* **Gerenciamento Completo**: Adicione, edite e remova produtos.
* **Busca Flexível**: Pesquise produtos tanto pelo **Nome** quanto pelo **ID** (código único de 7 dígitos).
* **Ordenação**: Classifique a lista por Preço ou Estoque.
* **Edição Detalhada**: Clique em qualquer produto para editar suas informações (Preço, Estoque, Nome, Imagem).
* **IDs Únicos**: O sistema gera automaticamente IDs únicos de 7 dígitos (ex: `1000001`) para cada produto.

### 2. Visualização da Árvore AVL

* **Interatividade em Tempo Real**: Observe a árvore sendo construída, nós sendo inseridos e as rotações de balanceamento (Simples/Dupla, Esquerda/Direita) acontecendo visualmente.
* **Estrutura de Dados**: A árvore é organizada internamente pelo **Preço** dos produtos, garantindo buscas e inserções eficientes O(log n).

### 3. Painel de Performance (Benchmark)

* **Comparativo AVL vs Lista**: Execute testes de estresse com milhares de produtos.
* **Métricas**: Compare o tempo de Geração, Inserção e Busca entre a estrutura AVL e uma Lista linear (Array).
* **Gráficos**: Visualização clara da diferença de desempenho.

### 4. Operações em Lote

* **Importação em Massa**: Adicione múltiplos produtos de uma vez através de uma interface de entrada de texto (CSV).

## Tecnologias Utilizadas

### Frontend (Aplicação Principal)

* **React.js**: Biblioteca para construção da interface.
* **Vite**: Build tool rápida e moderna.
* **Tailwind CSS**: Framework de estilização utilitário.
* **Framer Motion**: Para animações fluidas de transição e visualização da árvore.
* **Lucide React**: Ícones modernos.

### Backend (Referência/API)

* **Python 3**: Linguagem base.
* **FastAPI**: Framework para criação da API REST.
* **Estrutura AVL**: Implementação pura da árvore AVL em Python para fins acadêmicos e validação.

## Como Executar

### Pré-requisitos

* Node.js (v16 ou superior)
* Python 3.8+ (Opcional, para o backend)

### Rodando o Frontend (Recomendado)

A aplicação React contém toda a lógica da AVL implementada em JavaScript para visualização imediata.

1. Clone o repositório e entre na pasta:
   ```bash
   cd Ecomerce-AEDII
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
4. Acesse **http://localhost:5173** no seu navegador.

### Rodando o Backend (Opcional)

O backend serve como uma implementação de referência da estrutura de dados em Python.

1. Entre na pasta do backend:
   ```bash
   cd backend
   ```
2. Instale as dependências:
   ```bash
   pip install -r requirements.txt
   ```
3. Execute o servidor:
   ```bash
   uvicorn app:app --reload
   ```

## Estrutura do Projeto

* src/hooks/useAVLTree.js: O "coração" da aplicação. Contém a implementação da Árvore AVL em JavaScript (Inserção, Rotações, Balanceamento).
* src/components/: Componentes da interface (Catálogo, Modal, Visualização da Árvore).
* backend/: Implementação equivalente em Python (arquivos `arvore_avl.py`, `no.py`).

## Autores

Projeto desenvolvido por **Alejjandro, Dieglison, Joel, Lanna, Peterson** para a disciplina de Algoritmos e Estrutura de Dados II.
