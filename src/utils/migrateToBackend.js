// Script utilitário para migrar dados do localStorage para o backend
// Execute isso no Console do navegador (F12 > Console) uma única vez

async function migrarDadosParaBackend() {
    const API_URL = 'http://localhost:8000';
    const stored = localStorage.getItem('ecommerce-produtos');
    
    if (!stored) {
        console.log('Nenhum dado para migrar.');
        return;
    }
    
    const produtos = JSON.parse(stored);
    console.log(`Encontrados ${produtos.length} produtos para migrar...`);
    
    for (const produto of produtos) {
        try {
            await fetch(`${API_URL}/products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(produto)
            });
            console.log(`✅ Produto "${produto.nome}" migrado`);
        } catch (error) {
            console.error(`❌ Erro ao migrar "${produto.nome}":`, error);
        }
    }
    
    console.log('Migração concluída!');
}

// Execute a função
migrarDadosParaBackend();
