from model import Product, CategoriaEnum
from avl_catalog_product import ProductCatalogAVL


def main():
    catalogo = ProductCatalogAVL()

    p1 = Product(codigo=101, nome="Notebook Lenovo", preco=3500.0, quantidade=10, categoria=[CategoriaEnum.ELETRONICOS])
    p2 = Product(codigo=102, nome="Camisa Polo", preco=120.0, quantidade=25, categoria=[CategoriaEnum.ROUPAS])
    p3 = Product(codigo=103, nome="Bicicleta Aro 29", preco=1800.0, quantidade=5, categoria=[CategoriaEnum.ESPORTES])

    catalogo.adicionar_produto(p1)
    catalogo.adicionar_produto(p2)
    catalogo.adicionar_produto(p3)

    print("\nListando produtos em ordem:")
    catalogo.listar_produtos()

    print("\nBuscando produto com código 102:")
    catalogo.buscar_produto(102)

    print("\nRemovendo produto com código 101:")
    catalogo.remover_produto(101)

    print("\nListando após remoção:")
    catalogo.listar_produtos()


if __name__ == "__main__":
    main()
