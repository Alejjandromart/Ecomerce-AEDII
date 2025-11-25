import React, { useState } from 'react';
import { useProductStore } from '../hooks/useProductStore';
import { produtosExemplo } from '../utils/produtosExemplo';
import { Product } from '../types/product';
import toast from 'react-hot-toast';

interface TestResult {
    name: string;
    duration: number;
    ops: number; // Operações por segundo
    itemsProcessed: number;
    status: 'success' | 'error' | 'pending';
    message: string;
    details?: string;
}

export const PerformancePage: React.FC = () => {
    const { addProduto, products, clearAllProducts } = useProductStore();
    const [results, setResults] = useState<TestResult[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);
    const [currentTest, setCurrentTest] = useState<string>('');

    const addLog = (msg: string) => {
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
    };

    const runTest = async (name: string, itemsCount: number, testFn: () => Promise<void>) => {
        setIsRunning(true);
        setCurrentTest(name);
        addLog(`🚀 Iniciando teste: ${name}...`);
        const startTime = performance.now();

        try {
            await testFn();
            const endTime = performance.now();
            const duration = endTime - startTime;
            const ops = itemsCount > 0 ? (itemsCount / (duration / 1000)) : 0;

            setResults(prev => [
                {
                    name,
                    duration,
                    ops,
                    itemsProcessed: itemsCount,
                    status: 'success',
                    message: `Concluído em ${duration.toFixed(2)}ms`,
                    details: `${ops.toFixed(2)} ops/s`
                },
                ...prev
            ]);
            addLog(`✅ ${name}: Sucesso (${duration.toFixed(2)}ms) - ${ops.toFixed(2)} ops/s`);
            toast.success(`${name} concluído!`);
        } catch (error) {
            console.error(error);
            setResults(prev => [
                {
                    name,
                    duration: 0,
                    ops: 0,
                    itemsProcessed: 0,
                    status: 'error',
                    message: 'Falha na execução'
                },
                ...prev
            ]);
            addLog(`❌ ${name}: Falhou`);
            toast.error(`Erro no teste ${name}`);
        } finally {
            setIsRunning(false);
            setCurrentTest('');
        }
    };

    const handleLoadTest = async () => {
        const count = produtosExemplo.length;
        await runTest('Carga de Dados (47 produtos)', count, async () => {
            clearAllProducts();
            addLog('Limpando banco de dados...');
            // Adiciona sequencialmente para medir o impacto real na UI/Store
            for (let i = 0; i < count; i++) {
                const produto: Product = {
                    ...produtosExemplo[i],
                    id: `perf-ui-${Date.now()}-${i}`
                };
                await addProduto(produto);
                if (i % 10 === 0) addLog(`Processado ${i}/${count}...`);
            }
        });
    };

    const handleSearchTest = async () => {
        // Garante que tem dados suficientes para um teste significativo
        const targetSize = 100;
        const currentSize = products.length;

        if (currentSize < targetSize) {
            addLog(`Gerando ${targetSize - currentSize} itens adicionais para o teste...`);
            for (let i = 0; i < (targetSize - currentSize); i++) {
                await addProduto({
                    id: `search-gen-${Date.now()}-${i}`,
                    nome: `Produto de Busca ${i}`,
                    preco: 10 + i,
                    categoria: 'Teste',
                    quantidade: 10
                });
            }
        }

        await runTest(`Busca em Memória (${products.length} itens)`, products.length, async () => {
            const startSearch = performance.now();
            // Executa múltiplas buscas para ter uma média melhor
            const iterations = 100;
            let foundCount = 0;

            for (let i = 0; i < iterations; i++) {
                const filtered = products.filter(p => p.nome.toLowerCase().includes('produto'));
                foundCount = filtered.length;
            }

            const endSearch = performance.now();
            // Ajusta o tempo para refletir uma única busca
            const avgTime = (endSearch - startSearch) / iterations;

            addLog(`Média de ${iterations} buscas: ${avgTime.toFixed(4)}ms. Encontrados: ${foundCount}`);

            // Pequeno delay artificial para visualização se for muito rápido
            await new Promise(r => setTimeout(r, 500));
        });
    };

    const handleStressTest = async () => {
        const count = 50;
        await runTest(`Teste de Stress (+${count} itens)`, count, async () => {
            for (let i = 0; i < count; i++) {
                await addProduto({
                    id: `stress-${Date.now()}-${i}`,
                    nome: `Produto Stress ${i}`,
                    preco: Math.random() * 1000,
                    categoria: `Categoria ${i % 5}`,
                    quantidade: Math.floor(Math.random() * 100)
                });
                if (i % 10 === 0) addLog(`Inserindo ${i}/${count}...`);
            }
        });
    };

    const clearResults = () => {
        setResults([]);
        setLogs([]);
    };

    // Função para avaliar a performance
    const getPerformanceGrade = (ops: number, type: string) => {
        // Critérios diferentes para busca (muito mais rápida) e escrita
        const isSearch = type.toLowerCase().includes('busca');

        if (isSearch) {
            if (ops > 10000) return { label: '🚀 Excelente', color: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50' };
            if (ops > 1000) return { label: '⚡ Muito Bom', color: 'bg-blue-500', text: 'text-blue-700', bg: 'bg-blue-50' };
            if (ops > 100) return { label: '⚠️ Aceitável', color: 'bg-yellow-500', text: 'text-yellow-700', bg: 'bg-yellow-50' };
            return { label: '🐌 Lento', color: 'bg-red-500', text: 'text-red-700', bg: 'bg-red-50' };
        } else {
            // Critérios para escrita (Carga/Stress)
            if (ops > 50) return { label: '🚀 Excelente', color: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50' };
            if (ops > 20) return { label: '⚡ Muito Bom', color: 'bg-blue-500', text: 'text-blue-700', bg: 'bg-blue-50' };
            if (ops > 5) return { label: '⚠️ Aceitável', color: 'bg-yellow-500', text: 'text-yellow-700', bg: 'bg-yellow-50' };
            return { label: '🐌 Lento', color: 'bg-red-500', text: 'text-red-700', bg: 'bg-red-50' };
        }
    };

    // Encontra o maior tempo para escalar o gráfico
    const maxDuration = Math.max(...results.map(r => r.duration), 1000);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">🚀 Dashboard de Performance</h1>
                        <p className="text-gray-600 mt-1">Análise de desempenho em tempo real da Árvore AVL e operações de dados</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Status do Sistema</p>
                            <div className="flex items-center justify-end">
                                <span className={`h-3 w-3 rounded-full mr-2 ${isRunning ? 'bg-yellow-400 animate-pulse' : 'bg-green-500'}`}></span>
                                <span className="font-medium text-gray-700">{isRunning ? 'Executando Testes...' : 'Pronto'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Painel de Controle */}
                    <div className="bg-white rounded-xl shadow-lg p-6 lg:col-span-1 h-fit border border-gray-100">
                        <h2 className="text-lg font-bold mb-4 text-gray-800 flex items-center">
                            <span className="text-xl mr-2">🎛️</span> Controles de Teste
                        </h2>

                        <div className="space-y-4">
                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                <h3 className="font-semibold text-blue-900 mb-2">Carga de Dados</h3>
                                <p className="text-xs text-blue-700 mb-3">Simula a inserção sequencial de 47 produtos reais, forçando o rebalanceamento da árvore.</p>
                                <button
                                    onClick={handleLoadTest}
                                    disabled={isRunning}
                                    className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition flex items-center justify-center shadow-sm"
                                >
                                    {isRunning && currentTest.includes('Carga') && <span className="animate-spin mr-2">⏳</span>}
                                    Executar Carga
                                </button>
                            </div>

                            <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                                <h3 className="font-semibold text-green-900 mb-2">Busca Otimizada</h3>
                                <p className="text-xs text-green-700 mb-3">Mede o tempo de resposta para filtrar itens na memória (simulando busca na árvore).</p>
                                <button
                                    onClick={handleSearchTest}
                                    disabled={isRunning}
                                    className="w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 transition flex items-center justify-center shadow-sm"
                                >
                                    {isRunning && currentTest.includes('Busca') && <span className="animate-spin mr-2">⏳</span>}
                                    Testar Busca
                                </button>
                            </div>

                            <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                                <h3 className="font-semibold text-orange-900 mb-2">Stress Test</h3>
                                <p className="text-xs text-orange-700 mb-3">Insere 50 itens aleatórios rapidamente para testar limites de renderização e estado.</p>
                                <button
                                    onClick={handleStressTest}
                                    disabled={isRunning}
                                    className="w-full py-2 px-4 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50 transition flex items-center justify-center shadow-sm"
                                >
                                    {isRunning && currentTest.includes('Stress') && <span className="animate-spin mr-2">⏳</span>}
                                    Iniciar Stress
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-4 border-t">
                                <button
                                    onClick={clearAllProducts}
                                    disabled={isRunning}
                                    className="py-2 px-3 bg-red-50 text-red-600 rounded hover:bg-red-100 disabled:opacity-50 transition text-sm font-medium border border-red-200"
                                >
                                    Limpar Dados
                                </button>
                                <button
                                    onClick={clearResults}
                                    className="py-2 px-3 bg-gray-50 text-gray-600 rounded hover:bg-gray-100 transition text-sm font-medium border border-gray-200"
                                >
                                    Limpar Logs
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Resultados e Métricas */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Cards de Métricas Rápidas */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                <p className="text-xs text-gray-500 uppercase font-bold">Total Produtos</p>
                                <p className="text-2xl font-bold text-blue-600">{products.length}</p>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                <p className="text-xs text-gray-500 uppercase font-bold">Testes Executados</p>
                                <p className="text-2xl font-bold text-purple-600">{results.length}</p>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                <p className="text-xs text-gray-500 uppercase font-bold">Última Latência</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {results.length > 0 ? `${results[0].duration.toFixed(0)}ms` : '-'}
                                </p>
                            </div>
                        </div>

                        {/* Gráfico de Resultados */}
                        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                            <h2 className="text-lg font-bold mb-6 text-gray-800 flex items-center">
                                <span className="text-xl mr-2">📊</span> Análise de Resultados
                            </h2>

                            {results.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-48 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                                    <span className="text-4xl mb-2">📉</span>
                                    <p className="text-gray-500 font-medium">Nenhum dado de performance coletado</p>
                                    <p className="text-sm text-gray-400">Execute um teste para ver as métricas</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {results.map((res, idx) => {
                                        const grade = getPerformanceGrade(res.ops, res.name);
                                        return (
                                            <div key={idx} className="relative">
                                                <div className="flex justify-between items-end mb-1">
                                                    <div className="flex items-center">
                                                        <span className="font-medium text-gray-700 text-sm mr-2">{res.name}</span>
                                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${grade.bg} ${grade.text}`}>
                                                            {grade.label}
                                                        </span>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-xs text-gray-500 mr-2">{res.itemsProcessed} itens</span>
                                                        <span className={`font-bold text-sm ${res.status === 'success' ? 'text-gray-800' : 'text-red-600'}`}>
                                                            {res.duration.toFixed(2)} ms
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Barra de Progresso / Gráfico */}
                                                <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-1000 ${res.status === 'success' ? grade.color : 'bg-red-500'
                                                            }`}
                                                        style={{ width: `${Math.max((res.duration / maxDuration) * 100, 5)}%` }}
                                                    ></div>
                                                </div>

                                                <div className="flex justify-between mt-1 text-xs text-gray-500">
                                                    <span>{res.details}</span>
                                                    <span>{res.status === 'success' ? 'Concluído com sucesso' : 'Falha na execução'}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Logs em Tempo Real */}
                        <div className="bg-gray-900 rounded-xl shadow-lg p-4 text-gray-300 font-mono text-xs h-48 overflow-y-auto border border-gray-800 custom-scrollbar">
                            <div className="flex justify-between items-center mb-2 sticky top-0 bg-gray-900 pb-2 border-b border-gray-800">
                                <h3 className="text-gray-400 uppercase tracking-wider font-bold">Terminal de Logs</h3>
                                <span className="bg-gray-800 px-2 py-0.5 rounded text-[10px]">{logs.length} linhas</span>
                            </div>
                            {logs.length === 0 ? (
                                <div className="h-full flex items-center justify-center opacity-30">
                                    <span>Aguardando execução...</span>
                                </div>
                            ) : (
                                logs.map((log, i) => (
                                    <div key={i} className="mb-1 hover:bg-gray-800 px-1 rounded transition-colors">
                                        <span className="text-gray-500 mr-2">{log.split(']')[0]}]</span>
                                        <span className={log.includes('❌') ? 'text-red-400' : log.includes('✅') ? 'text-green-400' : 'text-gray-300'}>
                                            {log.split(']')[1]}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
