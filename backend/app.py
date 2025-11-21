"""
API REST para Catálogo de Produtos com Árvore AVL
Desenvolvido para a disciplina de Algoritmos e Estrutura de Dados II - UFAM

Endpoints disponíveis:
- GET  /           : Status da API
- GET  /produtos   : Lista todos os produtos
- POST /produtos   : Adiciona um novo produto
- GET  /produtos/{codigo} : Busca produto por código
- PUT  /produtos/{codigo} : Atualiza produto existente
- DELETE /produtos/{codigo} : Remove produto
- GET  /tree/visualize : Retorna diagrama Mermaid da árvore AVL
- GET  /estatisticas : Retorna altura e total de produtos
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from modelo import Produto
from catalogo_produtos_avl import CatalogoProdutosAVL

app = FastAPI(
    title="Catálogo de Produtos com AVL",
    description="API para gerenciamento de produtos usando estrutura de dados AVL",
    version="1.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

catalogo = CatalogoProdutosAVL()

@app.get("/")
def inicio():
    """
    Endpoint raiz - Verifica status da API
    
    Returns:
        dict: Mensagem de confirmação que a API está online
    """
    return {"mensagem": "API do Catálogo AVL está online 🚀"}

@app.get("/produtos")
def listar_produtos():
    """
    Lista todos os produtos cadastrados na árvore AVL
    
    Returns:
        dict: Lista de produtos com suas informações (código, nome, preço, quantidade, categoria)
    """
    produtos = catalogo.listar_produtos()
    return {"produtos": produtos}

@app.post("/produtos")
def adicionar_produto(produto: Produto):
    """
    Adiciona um novo produto na árvore AVL
    
    Args:
        produto (Produto): Objeto produto com código, nome, preço, quantidade e categoria
        
    Returns:
        dict: Mensagem de sucesso e dados do produto adicionado
    """
    catalogo.adicionar_produto(produto)
    return {"mensagem": "Produto adicionado com sucesso.", "produto": produto}

@app.get("/produtos/{codigo}")
def buscar_produto(codigo: int):
    """
    Busca um produto específico pelo código
    
    Args:
        codigo (int): Código único do produto
        
    Returns:
        dict: Dados do produto encontrado
        
    Raises:
        HTTPException: 404 se produto não for encontrado
    """
    produto = catalogo.buscar_produto(codigo)
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado.")
    return {"produto": produto}

@app.delete("/produtos/{codigo}")
def remover_produto(codigo: int):
    """
    Remove um produto da árvore AVL pelo código
    
    Args:
        codigo (int): Código do produto a ser removido
        
    Returns:
        dict: Mensagem de confirmação da remoção
    """
    catalogo.remover_produto(codigo)
    return {"mensagem": f"Produto {codigo} removido com sucesso."}

@app.put("/produtos/{codigo}")
def atualizar_produto(codigo: int, novo_produto: Produto):
    """
    Atualiza um produto existente
    Remove o antigo e adiciona o novo para manter balanceamento da AVL
    
    Args:
        codigo (int): Código do produto a ser atualizado
        novo_produto (Produto): Novos dados do produto
        
    Returns:
        dict: Mensagem de sucesso e dados atualizados
    """
    catalogo.remover_produto(codigo)
    catalogo.adicionar_produto(novo_produto)
    return {"mensagem": "Produto atualizado.", "produto": novo_produto}

@app.get("/arvore/avl")
def exibir_arvore():
    """
    Retorna a representação Mermaid da árvore AVL
    
    Returns:
        dict: String em formato Mermaid para visualização gráfica
    """
    return {"mermaid": catalogo.para_mermaid()}

@app.get("/tree/visualize")
def visualizar_arvore():
    """
    Endpoint compatível com frontend - Retorna diagrama Mermaid da árvore
    Alias para /arvore/avl com formato esperado pelo frontend
    
    Returns:
        dict: String Mermaid com chave 'mermaid_string'
    """
    return {"mermaid_string": catalogo.para_mermaid()}

@app.get("/estatisticas")
def estatisticas():
    """
    Retorna estatísticas da árvore AVL
    
    Returns:
        dict: Altura da árvore e total de produtos cadastrados
    """
    avl = catalogo.avl
    altura = avl.obter_altura(avl.raiz)
    total = catalogo.contar_produtos()
    return {
        "altura": altura,
        "total_produtos": total,
    }
