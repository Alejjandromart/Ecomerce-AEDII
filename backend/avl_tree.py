
from node import Node

class AVLTree:
    def __init__(self):
        self.root = None

    def get_height(self, node):
        if not node:
            return 0
        return node.height

    def get_balance(self, node):
        if not node:
            return 0
        return self.get_height(node.left) - self.get_height(node.right)

    def rotate_right(self, y):
        x = y.left
        T2 = x.right

        x.right = y
        y.left = T2

       
        y.height = 1 + max(self.get_height(y.left), self.get_height(y.right))
        x.height = 1 + max(self.get_height(x.left), self.get_height(x.right))

        return x  
    
    def rotate_left(self, x):
        y = x.right
        T2 = y.left

        
        y.left = x
        x.right = T2

        
        x.height = 1 + max(self.get_height(x.left), self.get_height(x.right))
        y.height = 1 + max(self.get_height(y.left), self.get_height(y.right))

        return y  
   
    def insert(self, node, key, value=None):
       
        if not node:
            return Node(key, value)
        elif key < node.key:
            node.left = self.insert(node.left, key, value)
        else:
            node.right = self.insert(node.right, key, value)

        
        node.height = 1 + max(self.get_height(node.left), self.get_height(node.right))

        
        balance = self.get_balance(node)

        
        if balance > 1 and key < node.left.key:
            return self.rotate_right(node)

        
        if balance < -1 and key > node.right.key:
            return self.rotate_left(node)

        
        if balance > 1 and key > node.left.key:
            node.left = self.rotate_left(node.left)
            return self.rotate_right(node)

        
        if balance < -1 and key < node.right.key:
            node.right = self.rotate_right(node.right)
            return self.rotate_left(node)

        return node

    def insert_key(self, key, value=None):
        self.root = self.insert(self.root, key, value)
    
    def remove(self, node, key):
        if not node:
            return node

        if key < node.key:
            node.left = self.remove(node.left, key)
        elif key > node.key:
            node.right = self.remove(node.right, key)
        else:
            if not node.left:
                temp = node.right
                node = None
                return temp
            elif not node.right:
                temp = node.left
                node = None
                return temp

            temp = self.get_min_value_node(node.right)
            node.key = temp.key
            node.value = temp.value
            node.right = self.remove(node.right, temp.key)

        if not node:
            return node

        node.height = 1 + max(self.get_height(node.left), self.get_height(node.right))
        balance = self.get_balance(node)

        if balance > 1 and self.get_balance(node.left) >= 0:
            return self.rotate_right(node)
        if balance > 1 and self.get_balance(node.left) < 0:
            node.left = self.rotate_left(node.left)
            return self.rotate_right(node)
        if balance < -1 and self.get_balance(node.right) <= 0:
            return self.rotate_left(node)
        if balance < -1 and self.get_balance(node.right) > 0:
            node.right = self.rotate_right(node.right)
            return self.rotate_left(node)

        return node

    def get_min_value_node(self, node):
        current = node
        while current.left is not None:
            current = current.left
        return current

    def remove_key(self, key):
        self.root = self.remove(self.root, key)


    
    def search(self, node, key):
        if not node or node.key == key:
            return node
        elif key < node.key:
            return self.search(node.left, key)
        else:
            return self.search(node.right, key)


    def in_order_traversal(self, node=None):
        if self.root is None:
            print("Árvore vazia")
            return

        def _in_order(n):
            if n is not None:
                _in_order(n.left)
                print(n.key, end=" ")
                _in_order(n.right)

        _in_order(self.root)


    
    def generate_mermaid(self, node=None):
        if node is None:
            node = self.root
        result = "graph TD;\n"
        nodes = []
        edges = []

        def traverse(n):
            if n:
                nodes.append(f"{n.key}(( {n.key} ))")
                if n.left:
                    edges.append(f"{n.key} --> {n.left.key}")
                    traverse(n.left)
                if n.right:
                    edges.append(f"{n.key} --> {n.right.key}")
                    traverse(n.right)

        traverse(node)
        result += "\n".join(nodes + edges)
        return result
