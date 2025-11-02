# 🛒 Ecomerce-AEDII

Sistema de gerenciamento de produtos com visualização de estrutura de dados AVL, desenvolvido para a disciplina de **Algoritmos e Estrutura de Dados II** da UFAM.

---

## 📋 Sobre o Projeto

Sistema web interativo que combina um e-commerce com conceitos acadêmicos de estruturas de dados, especificamente **Árvore AVL**. O projeto permite:

- 📦 Gerenciamento completo de produtos (CRUD)
- 🌲 Visualização gráfica da árvore AVL
- 📊 Análise de complexidade e estatísticas
- 💾 Persistência offline com localStorage
- 🔄 Modo híbrido (online/offline)

---

## 🚀 Tecnologias

- **React 19.1.1** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite 7.1.7** - Build tool
- **Tailwind CSS 4.1.16** - Estilização
- **Zustand** - Gerenciamento de estado
- **React Hook Form + Zod** - Formulários e validação
- **Mermaid.js** - Visualização de diagramas
- **Vitest** - Testes automatizados

---

## 📦 Instalação

```bash
# Clone o repositório
git clone https://github.com/Alejjandromart/Ecomerce-AEDII.git

# Entre no diretório
cd Ecomerce-AEDII

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse: `http://localhost:5173`

---

## 🎯 Funcionalidades

### 🏠 Home
Página inicial com cards de navegação para todas as funcionalidades.

### 📦 Produtos
- Cadastrar, editar e excluir produtos
- Busca por nome ou categoria
- Importação em lote de 47 produtos de exemplo
- Validação em português

### 🌲 Árvore AVL
- Visualização gráfica da estrutura AVL
- Renderização dinâmica com Mermaid.js
- Atualização em tempo real

### 📊 Estatísticas
- Análise de complexidade (Big O)
- Altura da árvore e rotações estimadas
- Tabelas de desempenho
- Conteúdo educacional sobre AVL

---

## 🧪 Testes

### Executar Todos os Testes
```bash
npm test
```

### Interface Visual de Testes
```bash
npm run test:ui
```

### Cobertura de Código
```bash
npm run test:coverage
```

### Testes de Desempenho
```bash
npm run test:performance
```

### Testes Manuais E2E
```bash
npm run dev  # Em um terminal
node tests/e2e-manual.js  # Em outro terminal
```

---

## 📚 Documentação

- **[Histórico de Alterações](docs/AlteracoesProjeto.md)** - Todas as mudanças realizadas no projeto
- **[Documentação das Telas](docs/DocumentacaoTelas.md)** - Funcionalidades de cada página
- **[Estratégias de Teste](docs/TestesEstrategiasUso.md)** - Testes e cenários de uso
- **[Guia de Execução de Testes](docs/GuiaExecucaoTestes.md)** - Como rodar os testes

---

## 🔧 Configuração

### Modo Offline (Padrão)
Crie um arquivo `.env` na raiz:
```env
VITE_MODE=offline
VITE_API_URL=http://localhost:8000
```

### Modo Online (Backend)
Altere o `.env`:
```env
VITE_MODE=online
VITE_API_URL=http://localhost:8000
```

---

## 📂 Estrutura do Projeto

```
src/
├── components/       # Componentes React
├── hooks/           # Custom hooks (Zustand store)
├── pages/           # Páginas do sistema
├── services/        # API services
├── store/           # Gerenciamento de estado
├── types/           # TypeScript types
└── utils/           # Utilitários e dados de exemplo

tests/
├── functional.test.ts    # Testes funcionais
├── integration.test.ts   # Testes de integração
├── performance.test.ts   # Testes de desempenho
└── e2e-manual.js        # Checklist de testes manuais

docs/
├── AlteracoesProjeto.md       # Histórico de mudanças
├── DocumentacaoTelas.md       # Documentação das páginas
├── TestesEstrategiasUso.md    # Estratégias de teste
└── GuiaExecucaoTestes.md      # Guia de testes
```

---

## 🎓 Conceitos Acadêmicos Abordados

- **Árvore AVL** - Estrutura de dados auto-balanceada
- **Rotações** - Simples e duplas (LL, RR, LR, RL)
- **Complexidade** - Análise Big O (busca, inserção, remoção)
- **Altura da Árvore** - Cálculo e otimização
- **Balanceamento** - Fator de balanceamento e propriedades

---

## 👥 Autores

Desenvolvido por estudantes do 4º período de Ciência da Computação - UFAM

---

## 📄 Licença

Este projeto é de uso acadêmico.

---

**Última atualização:** 01/11/2025
