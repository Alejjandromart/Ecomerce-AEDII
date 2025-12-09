import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { Play, Activity, Clock, Database, Server } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/Card';
import { Button } from './ui/Button';

const PerformanceDashboard = ({ runStressTest }) => {
    const [results, setResults] = useState([]);
    const [isRunning, setIsRunning] = useState(false);
    const [customCount, setCustomCount] = useState(10000);

    const handleRunTest = async (count) => {
        setIsRunning(true);
        // Small delay to allow UI to update
        await new Promise(resolve => setTimeout(resolve, 100));

        const result = runStressTest(count);
        setResults(prev => {
            const newRunNumber = prev.length + 1;
            return [...prev, { 
                ...result, 
                timestamp: new Date().toLocaleTimeString(),
                runLabel: `#${newRunNumber} (${count})`
            }];
        });
        setIsRunning(false);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-heading text-foreground">Painel de Desempenho</h1>
                    <p className="text-muted-foreground mt-1">Analise o comportamento da árvore AVL sob alta carga.</p>
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                    <div className="flex items-center gap-2 bg-card/50 p-1.5 rounded-xl border border-border/50 mr-2 shadow-sm">
                        <input
                            type="number"
                            value={customCount}
                            onChange={(e) => setCustomCount(Number(e.target.value))}
                            className="w-32 px-3 py-1.5 bg-transparent outline-none text-lg font-bold font-mono text-right text-primary"
                            placeholder="Qtd."
                        />
                        <Button
                            onClick={() => handleRunTest(customCount)}
                            disabled={isRunning || customCount <= 0}
                            className="h-9 px-4 font-medium"
                        >
                            Executar
                        </Button>
                    </div>
                    <Button
                        onClick={() => handleRunTest(100)}
                        disabled={isRunning}
                        variant="outline"
                        className="gap-2"
                    >
                        <Play size={16} /> 100
                    </Button>
                    <Button
                        onClick={() => handleRunTest(1000)}
                        disabled={isRunning}
                        variant="outline"
                        className="gap-2"
                    >
                        <Play size={16} /> 1k
                    </Button>
                    <Button
                        onClick={() => handleRunTest(5000)}
                        disabled={isRunning}
                        className="gap-2 shadow-lg shadow-primary/25"
                    >
                        <Server size={16} /> 5k Stress
                    </Button>
                </div>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-200/20">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">Última Inserção</p>
                                <h3 className="text-2xl font-bold mt-2">{results.length > 0 ? `${results[results.length - 1].insertTime.toFixed(2)}ms` : '-'}</h3>
                            </div>
                            <div className="p-2 bg-blue-500/20 rounded-lg text-blue-600">
                                <Clock size={20} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-200/20">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Busca (30%)</p>
                                <h3 className="text-2xl font-bold mt-2">{results.length > 0 ? `${results[results.length - 1].searchTime.toFixed(2)}ms` : '-'}</h3>
                            </div>
                            <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-600">
                                <Database size={20} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-violet-500/10 to-violet-600/5 border-violet-200/20">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-medium text-violet-600 dark:text-violet-400 uppercase tracking-wider">Altura da Árvore</p>
                                <h3 className="text-2xl font-bold mt-2">{results.length > 0 ? results[results.length - 1].height : '-'}</h3>
                            </div>
                            <div className="p-2 bg-violet-500/20 rounded-lg text-violet-600">
                                <Activity size={20} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-200/20">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wider">Testes Realizados</p>
                                <h3 className="text-2xl font-bold mt-2">{results.length}</h3>
                            </div>
                            <div className="p-2 bg-amber-500/20 rounded-lg text-amber-600">
                                <Server size={20} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="glass">
                    <CardHeader>
                        <CardTitle>Inserção: AVL vs Lista</CardTitle>
                        <CardDescription>Comparativo de tempo de inserção (Menor é melhor).</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={results}>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                    <XAxis dataKey="runLabel" />
                                    <YAxis label={{ value: 'Tempo (ms)', angle: -90, position: 'insideLeft' }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Legend />
                                    <Bar dataKey="insertTime" name="AVL Insert" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="listInsertTime" name="List Insert" fill="#ef4444" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass">
                    <CardHeader>
                        <CardTitle>Busca: AVL vs Lista</CardTitle>
                        <CardDescription>Comparativo de tempo de busca (Menor é melhor).</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={results}>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                    <XAxis dataKey="runLabel" />
                                    <YAxis label={{ value: 'Tempo (ms)', angle: -90, position: 'insideLeft' }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Legend />
                                    <Line type="monotone" dataKey="searchTime" name="AVL Search" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4 }} />
                                    <Line type="monotone" dataKey="listSearchTime" name="List Search" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default PerformanceDashboard;
