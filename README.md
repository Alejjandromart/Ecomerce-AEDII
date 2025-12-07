# E-commerce AED II - Catálogo de Produtos com Árvore AVL

Este projeto é uma aplicação de catálogo de produtos desenvolvida para a disciplina de **Algoritmos e Estrutura de Dados II**. O objetivo principal é demonstrar a eficiência e o funcionamento de uma **Árvore AVL (Adelson-Velsky and Landis)** na prática, comparando-a com estruturas lineares (listas).

##  Funcionalidades

*   **Visualização Interativa da AVL**: Veja a árvore sendo construída e balanceada em tempo real no navegador.
*   **Gerenciamento de Produtos**: Adicione, remova e busque produtos.
*   **Painel de Performance**: Compare o tempo de inserção e busca entre a Árvore AVL e uma Lista tradicional.
*   **Implementação Híbrida**:
    *   **Frontend (Ativo)**: React + Vite. Toda a lógica da AVL roda no cliente para visualização instantânea.
    *   **Backend (Referência)**: Python + FastAPI. Implementação clássica da AVL disponível na pasta ackend/ para estudo.

##  Tecnologias

*   **Frontend**: React, Vite, TailwindCSS, Framer Motion (animações), Recharts (gráficos).
*   **Backend**: Python 3.x, FastAPI (código de referência).

##  Como Executar

### Frontend (Aplicação Principal)

1.  Instale as dependências:
    `ash
    npm install
    ``n
2.  Inicie o servidor de desenvolvimento:
    `ash
    npm run dev
    ``n
3.  Acesse http://localhost:5173 no seu navegador.

### Backend (Opcional - Para Estudo)

O backend em Python serve como uma implementação de referência da estrutura de dados.

1.  Entre na pasta do backend:
    `ash
    cd backend
    ``n
2.  Instale as dependências (recomendado usar venv):
    `ash
    pip install -r requirements.txt
    ``n
3.  Execute o servidor:
    `ash
    uvicorn app:app --reload
    ``n
##  Estrutura do Projeto

*   src/: Código fonte do Frontend React.
    *   hooks/useAVLTree.js: **Coração do projeto**. Contém a implementação da Árvore AVL em JavaScript.
    *   components/AVLTreeViz.jsx: Componente responsável por desenhar a árvore.
*   ackend/: Código fonte do Backend Python.
    *   rvore_avl.py: Implementação da classe AVL em Python.
    *   catalogo_produtos_avl.py: Gerenciador do catálogo.
*   docs/: Documentação complementar.

##  Sobre a Árvore AVL

A Árvore AVL é uma árvore binária de busca auto-balanceada. Ela garante que a altura da árvore seja sempre logarítmica em relação ao número de nós, garantindo operações de busca, inserção e remoção em tempo **O(log n)**.

Neste projeto, a árvore é organizada pelo **Preço** do produto.
*   **Preços menores**: Vão para a esquerda.
*   **Preços maiores**: Vão para a direita.
*   **Preços iguais**:
    *   Se o nome for igual: Atualiza o produto existente.
    *   Se o nome for diferente: Insere à direita (tratamento de colisão).

Para mais detalhes teóricos, consulte [docs/AVL_EXPLICACAO.md](docs/AVL_EXPLICACAO.md).
