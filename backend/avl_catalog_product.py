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
        produtos = []
        def em_ordem(node):
            if node:
                em_ordem(node.left)
                produtos.append({
                    "codigo": node.key,
                    "nome": node.value.nome,
                    "preco": node.value.preco,
                    "categoria": [c.value for c in node.value.categoria],
                    "quantidade": node.value.quantidade
                })
                em_ordem(node.right)
        em_ordem(self.avl.root)
        return produtos

    def to_mermaid(self):
        return self.generate_mermaid()

