"""
Módulo de Implementação de Árvore AVL
Estrutura de dados auto-balanceada para catálogo de produtos
"""

from no import No

class ArvoreAVL:
    """
    Árvore AVL (Adelson-Velsky e Landis)
    Árvore binária de busca auto-balanceada
    Garante operações O(log n) através de rotações
    """
    
    def __init__(self):
        """Inicializa uma árvore AVL vazia"""
        self.raiz = None

    def obter_altura(self, no):
        """
        Obtém a altura de um nó
        
        Args:
            no (No | None): Nó para obter altura
            
        Returns:
            int: Altura do nó (0 se None)
        """
        if not no:
            return 0
        return no.altura

    def obter_balanceamento(self, no):
        """
        Calcula o fator de balanceamento de um nó
        Balanceamento = altura(esquerda) - altura(direita)
        
        Args:
            no (No | None): Nó para calcular balanceamento
            
        Returns:
            int: Fator de balanceamento (-2 a +2 em árvore válida)
        """
        if not no:
            return 0
        return self.obter_altura(no.esquerda) - self.obter_altura(no.direita)

    def rotacionar_direita(self, y):
        """
        Rotação simples à direita
        Usada quando subárvore esquerda está desbalanceada
        
        Args:
            y (No): Nó raiz da subárvore a ser rotacionada
            
        Returns:
            No: Nova raiz após rotação
        """
        x = y.esquerda
        T2 = x.direita

        x.direita = y
        y.esquerda = T2

        y.altura = 1 + max(self.obter_altura(y.esquerda), self.obter_altura(y.direita))
        x.altura = 1 + max(self.obter_altura(x.esquerda), self.obter_altura(x.direita))

        return x
    
    def rotacionar_esquerda(self, x):
        """
        Rotação simples à esquerda
        Usada quando subárvore direita está desbalanceada
        
        Args:
            x (No): Nó raiz da subárvore a ser rotacionada
            
        Returns:
            No: Nova raiz após rotação
        """
        y = x.direita
        T2 = y.esquerda

        y.esquerda = x
        x.direita = T2

        x.altura = 1 + max(self.obter_altura(x.esquerda), self.obter_altura(x.direita))
        y.altura = 1 + max(self.obter_altura(y.esquerda), self.obter_altura(y.direita))

        return y

    def inserir(self, no, chave, valor=None):
        """
        Insere um nó recursivamente mantendo balanceamento AVL
        
        Args:
            no (No | None): Nó raiz da subárvore
            chave (int): Chave de ordenação (código do produto)
            valor: Objeto produto associado à chave
            
        Returns:
            No: Nova raiz da subárvore após inserção e balanceamento
        """
        if not no:
            print(f"[AVL]   ✓ Criando nó folha: ID={chave}")
            return No(chave, valor)
        
        if chave < no.chave:
            print(f"[AVL]   {chave} < {no.chave} → ⬅️  ESQUERDA")
            no.esquerda = self.inserir(no.esquerda, chave, valor)
        else:
            print(f"[AVL]   {chave} ≥ {no.chave} → ➡️  DIREITA")
            no.direita = self.inserir(no.direita, chave, valor)

        no.altura = 1 + max(self.obter_altura(no.esquerda), self.obter_altura(no.direita))
        balanceamento = self.obter_balanceamento(no)
        
        if balanceamento != 0:
            print(f"[AVL]   Nó {no.chave}: fator de balanceamento = {balanceamento}")

        # Caso Esquerda-Esquerda
        if balanceamento > 1 and chave < no.esquerda.chave:
            print(f"[AVL] 🔄 Rotação DIREITA no nó {no.chave}")
            return self.rotacionar_direita(no)
        # Caso Direita-Direita
        if balanceamento < -1 and chave > no.direita.chave:
            print(f"[AVL] 🔄 Rotação ESQUERDA no nó {no.chave}")
            return self.rotacionar_esquerda(no)
        # Caso Esquerda-Direita
        if balanceamento > 1 and chave > no.esquerda.chave:
            print(f"[AVL] 🔄 Rotação DUPLA: ESQUERDA-DIREITA no nó {no.chave}")
            no.esquerda = self.rotacionar_esquerda(no.esquerda)
            return self.rotacionar_direita(no)
        # Caso Direita-Esquerda
        if balanceamento < -1 and chave < no.direita.chave:
            print(f"[AVL] 🔄 Rotação DUPLA: DIREITA-ESQUERDA no nó {no.chave}")
            no.direita = self.rotacionar_direita(no.direita)
            return self.rotacionar_esquerda(no)

        return no

    def inserir_chave(self, chave, valor=None):
        """
        Método público para inserir na árvore
        
        Args:
            chave (int): Chave a ser inserida
            valor: Valor associado à chave
        """
        # Debug: verifica tipo da chave
        nome_produto = valor.nome if valor else "sem nome"
        print(f"[AVL] 📥 Inserindo '{nome_produto}' com ID={chave}")
        # Garante que a chave seja int
        if not isinstance(chave, int):
            chave = int(chave)
            print(f"[AVL] ⚠️  Chave convertida para int: {chave}")
        
        self.raiz = self.inserir(self.raiz, chave, valor)

    def remover(self, no, chave):
        """
        Remove um nó recursivamente mantendo balanceamento AVL
        
        Args:
            no (No | None): Nó raiz da subárvore
            chave (int): Chave do nó a ser removido
            
        Returns:
            No | None: Nova raiz da subárvore após remoção e balanceamento
        """
        if not no:
            return no

        if chave < no.chave:
            no.esquerda = self.remover(no.esquerda, chave)
        elif chave > no.chave:
            no.direita = self.remover(no.direita, chave)
        else:
            # Nó com um filho ou sem filhos
            if not no.esquerda:
                temp = no.direita
                no = None
                return temp
            elif not no.direita:
                temp = no.esquerda
                no = None
                return temp

            # Nó com dois filhos: substitui pelo sucessor in-ordem
            temp = self.obter_no_minimo(no.direita)
            no.chave = temp.chave
            no.valor = temp.valor
            no.direita = self.remover(no.direita, temp.chave)

        if not no:
            return no

        # Atualiza altura e rebalanceia
        no.altura = 1 + max(self.obter_altura(no.esquerda), self.obter_altura(no.direita))
        balanceamento = self.obter_balanceamento(no)

        # Caso Esquerda-Esquerda
        if balanceamento > 1 and self.obter_balanceamento(no.esquerda) >= 0:
            return self.rotacionar_direita(no)
        # Caso Esquerda-Direita
        if balanceamento > 1 and self.obter_balanceamento(no.esquerda) < 0:
            no.esquerda = self.rotacionar_esquerda(no.esquerda)
            return self.rotacionar_direita(no)
        # Caso Direita-Direita
        if balanceamento < -1 and self.obter_balanceamento(no.direita) <= 0:
            return self.rotacionar_esquerda(no)
        # Caso Direita-Esquerda
        if balanceamento < -1 and self.obter_balanceamento(no.direita) > 0:
            no.direita = self.rotacionar_direita(no.direita)
            return self.rotacionar_esquerda(no)

        return no

    def remover_chave(self, chave):
        """
        Método público para remover da árvore
        
        Args:
            chave (int): Chave a ser removida
        """
        self.raiz = self.remover(self.raiz, chave)

    def obter_no_minimo(self, no):
        """
        Encontra o nó com menor chave em uma subárvore
        
        Args:
            no (No): Raiz da subárvore
            
        Returns:
            No: Nó com menor chave (mais à esquerda)
        """
        atual = no
        while atual.esquerda is not None:
            atual = atual.esquerda
        return atual

    def buscar(self, no, chave):
        """
        Busca recursiva por uma chave na árvore
        Complexidade: O(log n)
        
        Args:
            no (No | None): Raiz da subárvore
            chave (int): Chave a ser buscada
            
        Returns:
            No | None: Nó encontrado ou None
        """
        if not no or no.chave == chave:
            return no
        elif chave < no.chave:
            return self.buscar(no.esquerda, chave)
        else:
            return self.buscar(no.direita, chave)

    def percorrer_em_ordem(self, no=None):
        """
        Percorre a árvore em ordem (esquerda → raiz → direita)
        Imprime as chaves em ordem crescente
        """
        if self.raiz is None:
            print("Árvore vazia")
            return

        def _em_ordem(n):
            if n:
                _em_ordem(n.esquerda)
                print(n.chave, end=" ")
                _em_ordem(n.direita)

        _em_ordem(self.raiz)

    def gerar_mermaid(self, no=None):
        """
        Gera representação da árvore em formato Mermaid
        Exibe informações do produto em cada nó
        
        Args:
            no (No | None): Raiz da subárvore (usa self.raiz se None)
            
        Returns:
            str: String em formato Mermaid com sintaxe graph TD
        """
        if no is None:
            no = self.raiz
        
        if no is None:
            return "graph TD;\nVazio[\"Árvore Vazia\"]"
            
        resultado = "graph TD;\n"
        nos = []
        arestas = []
        estilos = []

        def percorrer(n):
            if n:
                # Formata o label do nó com informações do produto
                if n.valor:
                    # Limita o nome a 20 caracteres
                    nome = n.valor.nome[:20] + "..." if len(n.valor.nome) > 20 else n.valor.nome
                    preco = f"R$ {n.valor.preco:.2f}"
                    # Mostra ID completo para IDs pequenos (até 5 dígitos)
                    chave_str = str(n.chave)
                    id_display = chave_str if len(chave_str) <= 5 else f"...{chave_str[-4:]}"
                    label = f"ID: {id_display}<br/>{nome}<br/>{preco}<br/>Qtd: {n.valor.quantidade}"
                    nos.append(f'    Node{n.chave}["{label}"]')
                else:
                    nos.append(f'    Node{n.chave}["{n.chave}"]')
                
                # Adiciona estilo para o nó
                estilos.append(f"    style Node{n.chave} fill:#60a5fa,stroke:#2563eb,stroke-width:2px,color:#fff")
                
                if n.esquerda:
                    arestas.append(f"    Node{n.chave} --> Node{n.esquerda.chave}")
                    percorrer(n.esquerda)
                if n.direita:
                    arestas.append(f"    Node{n.chave} --> Node{n.direita.chave}")
                    percorrer(n.direita)

        percorrer(no)
        resultado += "\n".join(nos + [""] + arestas + [""] + estilos)
        return resultado
