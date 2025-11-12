from fastapi import FastAPI, HTTPException
from modelo import Produto
from catalogo_produtos_avl import CatalogoProdutosAVL

app = FastAPI(title="Catálogo de Produtos com AVL")

catalogo = CatalogoProdutosAVL()

@app.get("/")
def inicio():
    return {"mensagem": "API do Catálogo AVL está online 🚀"}

@app.get("/produtos")
def listar_produtos():
    produtos = catalogo.listar_produtos()
    return {"produtos": produtos}

@app.post("/produtos")
def adicionar_produto(produto: Produto):
    catalogo.adicionar_produto(produto)
    return {"mensagem": "Produto adicionado com sucesso.", "produto": produto}

@app.get("/produtos/{codigo}")
def buscar_produto(codigo: int):
    produto = catalogo.buscar_produto(codigo)
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado.")
    return {"produto": produto}

@app.delete("/produtos/{codigo}")
def remover_produto(codigo: int):
    catalogo.remover_produto(codigo)
    return {"mensagem": f"Produto {codigo} removido com sucesso."}

@app.put("/produtos/{codigo}")
def atualizar_produto(codigo: int, novo_produto: Produto):
    catalogo.remover_produto(codigo)
    catalogo.adicionar_produto(novo_produto)
    return {"mensagem": "Produto atualizado.", "produto": novo_produto}

@app.get("/arvore/avl")
def exibir_arvore():
    return {"mermaid": catalogo.para_mermaid()}

@app.get("/estatisticas")
def estatisticas():
    avl = catalogo.avl
    altura = avl.obter_altura(avl.raiz)
    total = catalogo.contar_produtos()
    return {
        "altura": altura,
        "total_produtos": total,
    }
