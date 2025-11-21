# 🔗 Guia de Integração Frontend-Backend

## 📋 Visão Geral

Este guia explica como conectar o frontend React com o backend Python (FastAPI) para usar a árvore AVL real.

---

## 🎯 Modos de Operação

### 🔵 Modo Offline (Padrão)
- Usa **localStorage** para armazenar produtos
- Não precisa do backend rodando
- Árvore AVL simulada no frontend

### 🟢 Modo Online
- Conecta com **backend FastAPI**
- Árvore AVL real implementada em Python
- Todas as operações são persistidas no backend

---

## 🚀 Passo a Passo

### 1️⃣ Instalar Dependências do Backend

```bash
cd backend
pip install -r requirements.txt
```

### 2️⃣ Iniciar o Backend

**Opção A - Comando direto:**
```bash
cd backend
uvicorn app:app --reload
```

**Opção B - Script PowerShell:**
```powershell
.\start-backend.ps1
```

O backend estará disponível em:
- API: http://localhost:8000
- Docs: http://localhost:8000/docs

### 3️⃣ Configurar Frontend para Modo Online

Edite o arquivo `.env` na raiz do projeto:

```env
VITE_MODE=online
VITE_API_URL=http://localhost:8000
```

### 4️⃣ Reiniciar o Frontend

```bash
npm run dev
```

Acesse: http://localhost:5173

---

## 🔍 Verificando a Conexão

### ✅ Backend funcionando:
1. Acesse http://localhost:8000
2. Deve retornar: `{"mensagem": "API do Catálogo AVL está online 🚀"}`

### ✅ Frontend conectado:
1. Na página de Árvore AVL, você verá: **● Online** (verde)
2. Produtos adicionados no frontend aparecerão na árvore real
3. Abra o console do navegador e verifique se não há erros de CORS

---

## 📡 Endpoints da API

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/` | Status da API |
| GET | `/produtos` | Lista todos os produtos |
| POST | `/produtos` | Adiciona um produto |
| GET | `/produtos/{codigo}` | Busca produto por código |
| PUT | `/produtos/{codigo}` | Atualiza um produto |
| DELETE | `/produtos/{codigo}` | Remove um produto |
| GET | `/arvore/avl` | Retorna diagrama Mermaid da árvore |
| GET | `/tree/visualize` | Alias para frontend |
| GET | `/estatisticas` | Altura e total de produtos |

---

## 🐛 Solução de Problemas

### Erro de CORS
Se aparecer erro de CORS no console:
```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Solução:** Certifique-se que o backend tem CORS configurado (já está no `app.py`)

### Backend não inicia
```
ModuleNotFoundError: No module named 'fastapi'
```

**Solução:** Instale as dependências:
```bash
pip install -r backend/requirements.txt
```

### Frontend não conecta
Se o frontend não conecta mesmo com backend rodando:

1. Verifique o `.env`:
   ```env
   VITE_MODE=online
   VITE_API_URL=http://localhost:8000
   ```

2. Reinicie o Vite (Ctrl+C e `npm run dev`)

3. Limpe o cache do navegador

---

## 🧪 Testando a Integração

### 1. Adicionar produto no frontend
- Vá em **Produtos** → **Adicionar Produto**
- Preencha os dados e salve

### 2. Verificar no backend
```bash
# Em outro terminal
curl http://localhost:8000/produtos
```

### 3. Ver árvore AVL
- Vá em **Árvore AVL**
- Deve mostrar a estrutura real da árvore Python

---

## 📊 Comparação de Modos

| Característica | Offline | Online |
|----------------|---------|--------|
| Backend necessário | ❌ Não | ✅ Sim |
| Persistência | localStorage | Backend |
| Árvore AVL | Simulada | Real (Python) |
| Performance | Rápido | Depende da rede |
| Aprendizado | Limitado | Completo |

---

## 🎓 Recomendações

- **Para desenvolvimento rápido:** Use modo offline
- **Para demonstração acadêmica:** Use modo online
- **Para apresentação:** Tenha ambos preparados

---

## 📝 Notas Importantes

1. O modo é definido no **build time** (não runtime)
2. Sempre reinicie o Vite após mudar o `.env`
3. O backend não persiste dados entre reinicializações
4. Para persistência real, adicione um banco de dados

---

## 🔗 Links Úteis

- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Árvores AVL - Teoria](https://www.ime.usp.br/~pf/estruturas-de-dados/aulas/st-avl.html)
