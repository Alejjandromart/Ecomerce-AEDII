from arvore_avl import ArvoreAVL
from modelo import Produto

class CatalogoProdutosAVL:
    def __init__(self):
        self.avl = ArvoreAVL()

    def adicionar_produto(self, produto: Produto):
        self.avl.inserir_chave(produto.codigo, produto)
        print(f"Produto adicionado: {produto}")

    def remover_produto(self, codigo: int):
        self.avl.remover_chave(codigo)
        print(f"Produto removido: código {codigo}")

    def buscar_produto(self, codigo: int):
        no = self.avl.buscar(self.avl.raiz, codigo)
        if no:
            print(f"Produto encontrado: {no.valor}")
            return no.valor
        else:
            print(f"Produto com código {codigo} não encontrado.")
            return None

    def listar_produtos(self):
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
        return self.avl.gerar_mermaid()

    def contar_produtos(self):
        return len(self.listar_produtos())
