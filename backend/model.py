from pydantic import BaseModel, Field
from typing import List
from enum import Enum


class CategoriaEnum(str, Enum):
    ELETRONICOS = "Eletrônicos"
    ROUPAS = "Roupas"
    ALIMENTOS = "Alimentos"
    MOVEIS = "Móveis"
    LIVROS = "Livros"
    BRINQUEDOS = "Brinquedos"
    BELEZA = "Beleza"
    ESPORTES = "Esportes"
    OUTROS = "Outros"


class Product(BaseModel):
    codigo: int = Field(..., description="Código único do produto")
    nome: str = Field(..., description="Nome do produto")
    preco: float = Field(..., gt=0, description="Preço do produto")
    quantidade: int = Field(..., ge=0, description="Quantidade em estoque")
    categoria: List[CategoriaEnum] = Field(..., description="Categorias do produto")

    def __str__(self):
        return f"[{self.codigo}] {self.nome} - R${self.preco:.2f} ({self.quantidade} un.)"
