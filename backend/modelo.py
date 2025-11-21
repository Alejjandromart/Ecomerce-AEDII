"""
Módulo de Modelos de Dados
Define schemas Pydantic para validação e serialização de produtos
"""

from pydantic import BaseModel, Field
from typing import List
from enum import Enum

class CategoriaEnum(str, Enum):
    """
    Enumeração de categorias de produtos disponíveis
    Garante consistência nas categorias do catálogo
    """
    ELETRONICOS = "Eletrônicos"
    ROUPAS = "Roupas"
    ALIMENTOS = "Alimentos"
    MOVEIS = "Móveis"
    LIVROS = "Livros"
    BRINQUEDOS = "Brinquedos"
    BELEZA = "Beleza"
    ESPORTES = "Esportes"
    OUTROS = "Outros"

class Produto(BaseModel):
    """
    Modelo de dados para Produto
    Utiliza Pydantic para validação automática de tipos e valores
    
    Attributes:
        codigo (int): Identificador único do produto
        nome (str): Nome descritivo do produto
        preco (float): Preço unitário (deve ser maior que 0)
        quantidade (int): Estoque disponível (maior ou igual a 0)
        categoria (List[CategoriaEnum]): Lista de categorias do produto
    """
    codigo: int = Field(..., description="Código único do produto")
    nome: str = Field(..., description="Nome do produto")
    preco: float = Field(..., gt=0, description="Preço do produto")
    quantidade: int = Field(..., ge=0, description="Quantidade em estoque")
    categoria: List[CategoriaEnum] = Field(..., description="Categorias do produto")

    def __str__(self):
        """
        Representação em string formatada do produto
        
        Returns:
            str: Formato '[codigo] nome - R$preco (quantidade un.)'
        """
        return f"[{self.codigo}] {self.nome} - R${self.preco:.2f} ({self.quantidade} un.)"
