"""
Módulo de Nó da Árvore AVL
Define a estrutura básica de um nó na árvore binária
"""

class No:
    """
    Representa um nó na Árvore AVL
    Armazena chave, valor e referências aos filhos
    """
    
    def __init__(self, chave, valor=None):
        """
        Inicializa um novo nó da árvore
        
        Args:
            chave (int): Chave de ordenação do nó (código do produto)
            valor: Objeto produto ou dado associado à chave
        """
        self.chave = chave
        self.valor = valor
        self.esquerda = None
        self.direita = None
        self.altura = 1
