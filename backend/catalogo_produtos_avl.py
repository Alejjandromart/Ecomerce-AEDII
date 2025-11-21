"""
Módulo de Catálogo de Produtos usando Árvore AVL
Camada de abstração entre a API e a estrutura de dados AVL
"""

from arvore_avl import ArvoreAVL
from modelo import Produto

class CatalogoProdutosAVL:
    """
    Gerencia um catálogo de produtos utilizando uma Árvore AVL
    Fornece operações de alto nível para CRUD de produtos
    """
    
    def __init__(self):
        """Inicializa o catálogo com uma árvore AVL vazia"""
        self.avl = ArvoreAVL()

    def adicionar_produto(self, produto: Produto):
        """
        Adiciona um produto no catálogo
        
        Args:
            produto (Produto): Produto a ser adicionado com código único
        """
        self.avl.inserir_chave(produto.codigo, produto)
        print(f"Produto adicionado: {produto}")

    def remover_produto(self, codigo: int):
        """
        Remove um produto do catálogo pelo código
        
        Args:
            codigo (int): Código do produto a ser removido
        """
        self.avl.remover_chave(codigo)
        print(f"Produto removido: código {codigo}")

    def buscar_produto(self, codigo: int):
        """
        Busca um produto pelo código
        Complexidade: O(log n)
        
        Args:
            codigo (int): Código do produto a buscar
            
        Returns:
            Produto | None: Produto encontrado ou None se não existir
        """
        no = self.avl.buscar(self.avl.raiz, codigo)
        if no:
            print(f"Produto encontrado: {no.valor}")
            return no.valor
        else:
            print(f"Produto com código {codigo} não encontrado.")
            return None

    def listar_produtos(self):
        """
        Lista todos os produtos em ordem crescente de código
        Utiliza percurso em-ordem na árvore AVL
        
        Returns:
            list: Lista de dicionários com dados dos produtos
        """
        produtos = []
        def em_ordem(no):
            if no:
                em_ordem(no.esquerda)
                produtos.append({
                    "codigo": no.chave,
                    "nome": no.valor.nome,
                    "preco": no.valor.preco,
                    "categoria": [c.value for c in no.valor.categoria],
                    "quantidade": no.valor.quantidade
                })
                em_ordem(no.direita)
        em_ordem(self.avl.raiz)
        return produtos

    def para_mermaid(self):
        """
        Gera representação da árvore em formato Mermaid
        
        Returns:
            str: String em formato Mermaid para visualização gráfica
        """
        return self.avl.gerar_mermaid()

    def contar_produtos(self):
        """
        Conta o número total de produtos no catálogo
        
        Returns:
            int: Quantidade de produtos cadastrados
        """
        return len(self.listar_produtos())
