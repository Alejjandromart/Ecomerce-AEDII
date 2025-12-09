# Entendendo a Árvore AVL (Adelson-Velsky and Landis)

A Árvore AVL foi a primeira estrutura de dados de árvore binária de busca auto-balanceada a ser inventada. Em uma árvore AVL, as alturas das duas subárvores filhas de qualquer nó diferem em no máximo um. Se a qualquer momento essa propriedade for violada, a árvore realiza operações chamadas **rotações** para se rebalancear.

## ⚖️ O Fator de Balanceamento

Para cada nó, calculamos o fator de balanceamento:
$$Balanceamento = Altura(Esquerda) - Altura(Direita)$$

Em uma AVL válida, esse fator deve ser sempre **-1, 0 ou 1**.
*   **> 1**: A subárvore esquerda está mais pesada (desbalanceada à esquerda).
*   **< -1**: A subárvore direita está mais pesada (desbalanceada à direita).

## 🔄 Rotações

Quando o fator de balanceamento sai do intervalo permitido, aplicamos rotações para corrigir. Existem 4 casos:

### 1. Rotação Simples à Direita (Caso Esquerda-Esquerda)
Acontece quando um nó é inserido na subárvore esquerda do filho esquerdo.
*   **Solução**: O filho esquerdo sobe e vira a nova raiz da subárvore.

### 2. Rotação Simples à Esquerda (Caso Direita-Direita)
Acontece quando um nó é inserido na subárvore direita do filho direito.
*   **Solução**: O filho direito sobe e vira a nova raiz da subárvore.

### 3. Rotação Dupla à Direita (Caso Esquerda-Direita)
Acontece quando um nó é inserido na subárvore direita do filho esquerdo.
*   **Passo 1**: Rotação à Esquerda no filho esquerdo.
*   **Passo 2**: Rotação à Direita no nó desbalanceado.

### 4. Rotação Dupla à Esquerda (Caso Direita-Esquerda)
Acontece quando um nó é inserido na subárvore esquerda do filho direito.
*   **Passo 1**: Rotação à Direita no filho direito.
*   **Passo 2**: Rotação à Esquerda no nó desbalanceado.

## 💻 Implementação no Projeto

Neste projeto de E-commerce, utilizamos a AVL para organizar os produtos.

### Critério de Ordenação
A árvore é ordenada pelo **PREÇO** do produto.
*   Produtos mais baratos ficam à esquerda.
*   Produtos mais caros ficam à direita.

### Tratamento de Duplicatas
Como é comum ter produtos com o mesmo preço em uma loja, implementamos uma lógica especial:

1.  **Mesmo Preço, Mesmo Nome**: Consideramos como o mesmo produto. O nó existente é atualizado com os novos dados (ex: atualização de estoque).
2.  **Mesmo Preço, Nome Diferente**: Consideramos produtos distintos. O novo produto é inserido na subárvore à **DIREITA**. Isso permite listar múltiplos produtos com o mesmo valor.

### Complexidade

| Operação | Lista (Array) | Árvore AVL |
| :--- | :--- | :--- |
| **Busca** | O(n) | **O(log n)** |
| **Inserção** | O(n) ou O(1)* | **O(log n)** |
| **Remoção** | O(n) | **O(log n)** |

*> Inserção em lista pode ser O(1) se for no final, mas O(n) se precisar manter ordenado.*

A AVL é muito superior para grandes volumes de dados onde buscas e inserções são frequentes, pois garante que nenhuma operação levará tempo excessivo, diferentemente de uma árvore binária comum que pode degenerar para uma lista (O(n)) se os dados forem inseridos em ordem.
