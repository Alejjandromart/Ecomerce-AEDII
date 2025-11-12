from no import No

class ArvoreAVL:
    def __init__(self):
        self.raiz = None

    def obter_altura(self, no):
        if not no:
            return 0
        return no.altura

    def obter_balanceamento(self, no):
        if not no:
            return 0
        return self.obter_altura(no.esquerda) - self.obter_altura(no.direita)

    def rotacionar_direita(self, y):
        x = y.esquerda
        T2 = x.direita

        x.direita = y
        y.esquerda = T2

        y.altura = 1 + max(self.obter_altura(y.esquerda), self.obter_altura(y.direita))
        x.altura = 1 + max(self.obter_altura(x.esquerda), self.obter_altura(x.direita))

        return x
    
    def rotacionar_esquerda(self, x):
        y = x.direita
        T2 = y.esquerda

        y.esquerda = x
        x.direita = T2

        x.altura = 1 + max(self.obter_altura(x.esquerda), self.obter_altura(x.direita))
        y.altura = 1 + max(self.obter_altura(y.esquerda), self.obter_altura(y.direita))

        return y

    def inserir(self, no, chave, valor=None):
        if not no:
            return No(chave, valor)
        elif chave < no.chave:
            no.esquerda = self.inserir(no.esquerda, chave, valor)
        else:
            no.direita = self.inserir(no.direita, chave, valor)

        no.altura = 1 + max(self.obter_altura(no.esquerda), self.obter_altura(no.direita))
        balanceamento = self.obter_balanceamento(no)

        if balanceamento > 1 and chave < no.esquerda.chave:
            return self.rotacionar_direita(no)
        if balanceamento < -1 and chave > no.direita.chave:
            return self.rotacionar_esquerda(no)
        if balanceamento > 1 and chave > no.esquerda.chave:
            no.esquerda = self.rotacionar_esquerda(no.esquerda)
            return self.rotacionar_direita(no)
        if balanceamento < -1 and chave < no.direita.chave:
            no.direita = self.rotacionar_direita(no.direita)
            return self.rotacionar_esquerda(no)

        return no

    def inserir_chave(self, chave, valor=None):
        self.raiz = self.inserir(self.raiz, chave, valor)

    def remover(self, no, chave):
        if not no:
            return no

        if chave < no.chave:
            no.esquerda = self.remover(no.esquerda, chave)
        elif chave > no.chave:
            no.direita = self.remover(no.direita, chave)
        else:
            if not no.esquerda:
                temp = no.direita
                no = None
                return temp
            elif not no.direita:
                temp = no.esquerda
                no = None
                return temp

            temp = self.obter_no_minimo(no.direita)
            no.chave = temp.chave
            no.valor = temp.valor
            no.direita = self.remover(no.direita, temp.chave)

        if not no:
            return no

        no.altura = 1 + max(self.obter_altura(no.esquerda), self.obter_altura(no.direita))
        balanceamento = self.obter_balanceamento(no)

        if balanceamento > 1 and self.obter_balanceamento(no.esquerda) >= 0:
            return self.rotacionar_direita(no)
        if balanceamento > 1 and self.obter_balanceamento(no.esquerda) < 0:
            no.esquerda = self.rotacionar_esquerda(no.esquerda)
            return self.rotacionar_direita(no)
        if balanceamento < -1 and self.obter_balanceamento(no.direita) <= 0:
            return self.rotacionar_esquerda(no)
        if balanceamento < -1 and self.obter_balanceamento(no.direita) > 0:
            no.direita = self.rotacionar_direita(no.direita)
            return self.rotacionar_esquerda(no)

        return no

    def remover_chave(self, chave):
        self.raiz = self.remover(self.raiz, chave)

    def obter_no_minimo(self, no):
        atual = no
        while atual.esquerda is not None:
            atual = atual.esquerda
        return atual

    def buscar(self, no, chave):
        if not no or no.chave == chave:
            return no
        elif chave < no.chave:
            return self.buscar(no.esquerda, chave)
        else:
            return self.buscar(no.direita, chave)

    def percorrer_em_ordem(self, no=None):
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
        if no is None:
            no = self.raiz
        resultado = "graph TD;\n"
        nos = []
        arestas = []

        def percorrer(n):
            if n:
                nos.append(f"{n.chave}(( {n.chave} ))")
                if n.esquerda:
                    arestas.append(f"{n.chave} --> {n.esquerda.chave}")
                    percorrer(n.esquerda)
                if n.direita:
                    arestas.append(f"{n.chave} --> {n.direita.chave}")
                    percorrer(n.direita)

        percorrer(no)
        resultado += "\n".join(nos + arestas)
        return resultado
