import React from 'react';
import { Package, BarChart2, List, Github, Activity } from 'lucide-react';
import { cn } from '../lib/utils';

const Layout = ({ activeTab, setActiveTab, children }) => {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-card/50 backdrop-blur-xl transition-transform">
                <div className="flex h-full flex-col px-3 py-4">
                    <div className="mb-10 flex items-center gap-3 px-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                            <Package size={20} />
                        </div>
                        <span className="text-xl font-bold font-heading tracking-tight">DeOlho Estoque</span>
                    </div>

                    <ul className="space-y-2 font-medium">
                        <li>
                            <button
                                onClick={() => setActiveTab('catalog')}
                                className={cn(
                                    "flex w-full items-center gap-3 rounded-lg px-3 py-3 transition-all duration-200 group",
                                    activeTab === 'catalog'
                                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                )}
                            >
                                <List size={20} />
                                <span className="flex-1 text-left">Catálogo</span>
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setActiveTab('avl')}
                                className={cn(
                                    "flex w-full items-center gap-3 rounded-lg px-3 py-3 transition-all duration-200 group",
                                    activeTab === 'avl'
                                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                )}
                            >
                                <BarChart2 size={20} />
                                <span className="flex-1 text-left">Árvore AVL</span>
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setActiveTab('performance')}
                                className={cn(
                                    "flex w-full items-center gap-3 rounded-lg px-3 py-3 transition-all duration-200 group",
                                    activeTab === 'performance'
                                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                )}
                            >
                                <Activity size={20} />
                                <span className="flex-1 text-left">Desempenho</span>
                            </button>
                        </li>
                    </ul>

                    <div className="mt-auto px-3 pb-4">
                        <div className="rounded-xl bg-accent/50 p-4 backdrop-blur-sm border border-border/50">
                            <p className="text-xs text-muted-foreground mb-2">Desenvolvido com React & Tailwind</p>
                            <div className="flex items-center gap-2 text-xs font-medium">
                                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                                Sistema Online
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="ml-64 p-8">
                <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
