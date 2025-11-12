from node import Node
from avl_tree import AVLTree

def main():
    
    arvore = AVLTree()

    
    valores = [30, 20, 40, 10, 25, 35, 50]
    print("Inserindo elementos na AVL:")
    for v in valores:
        arvore.insert_key(v)
        print(f"Inserido {v}")
    
    
    print("\nÁrvore AVL em ordem:")
    arvore.in_order_traversal()
    
    
    chave = 25
    encontrado = arvore.search(arvore.root, chave)
    if encontrado:
        print(f"\nChave {chave} encontrada na árvore.")
    else:
        print(f"\nChave {chave} não encontrada.")
    
    
    remover = 20
    print(f"\nRemovendo {remover} da árvore:")
    arvore.remove_key(remover)
    arvore.in_order_traversal()
    
    
    print("\nRepresentação Mermaid do grafo AVL:")
    print(arvore.generate_mermaid())


if __name__ == "__main__":
    main()
