from avl_tree import AVLTree
from model import Product


class ProductCatalogAVL:
    def __init__(self):
        self.avl = AVLTree()

    def adicionar_produto(self, produto: Product):
        self.avl.insert_key(produto.codigo, produto)
        print(f"Produto adicionado: {produto}")

    def remover_produto(self, codigo: int):
        self.avl.remove_key(codigo)
        print(f"Produto removido: código {codigo}")

    def buscar_produto(self, codigo: int):
        node = self.avl.search(self.avl.root, codigo)
        if node:
            print(f"Produto encontrado: {node.value}")
            return node.value
        else:
            print(f"Produto com código {codigo} não encontrado.")
            return None

    def listar_produtos(self):
        print("Produtos em ordem (AVL):")
        self.avl.in_order_traversal(self.avl.root)
