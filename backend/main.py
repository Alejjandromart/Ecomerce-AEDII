from fastapi import FastAPI, HTTPException
from model import Product
from avl_catalog_product import ProductCatalogAVL

app = FastAPI(title="Catálogo de Produtos com AVL")

catalogo = ProductCatalogAVL()

@app.get("/")
def home():
    return {"mensagem": "API do Catálogo AVL está online 🚀"}


@app.get("/products")
def listar_produtos():
    produtos = catalogo.listar_produtos()
    return {"produtos": produtos}


@app.post("/products")
def adicionar_produto(produto: Product):
    catalogo.adicionar_produto(produto)
    return {"mensagem": "Produto adicionado com sucesso.", "produto": produto}


@app.get("/products/{codigo}")
def buscar_produto(codigo: int):
    produto = catalogo.buscar_produto(codigo)
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado.")
    return {"produto": produto}


@app.delete("/products/{codigo}")
def remover_produto(codigo: int):
    catalogo.remover_produto(codigo)
    return {"mensagem": f"Produto {codigo} removido com sucesso."}


@app.put("/products/{codigo}")
def atualizar_produto(codigo: int, novo_produto: Product):
    catalogo.remover_produto(codigo)
    catalogo.adicionar_produto(novo_produto)
    return {"mensagem": "Produto atualizado.", "produto": novo_produto}


@app.get("/tree/avl")
def exibir_arvore():
    return {"mermaid": catalogo.avl.to_mermaid()}


@app.get("/stats")
def estatisticas():
    avl = catalogo.avl
    altura = avl.get_height(avl.root)
    total = catalogo.contar_produtos()
    return {
        "altura": altura,
        "total_produtos": total,
    }
