import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn, ZoomOut, Maximize, RefreshCw, Info } from 'lucide-react';
import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';

const TreeNode = ({ node, depth = 0 }) => {
    const [isHovered, setIsHovered] = useState(false);

    if (!node) return <div className="w-16 h-16 invisible" />; // Placeholder for spacing, invisible to keep layout

    // Calculate balance factor color
    const balance = (node.left?.height || 0) - (node.right?.height || 0);

    const getBalanceColor = (bf) => {
        if (bf === 0) return "bg-emerald-500 shadow-emerald-500/50";
        if (Math.abs(bf) === 1) return "bg-amber-500 shadow-amber-500/50";
        return "bg-rose-500 shadow-rose-500/50";
    };

    return (
        <div className="flex flex-col items-center mx-4">
            <motion.div
                initial={{ scale: 0, opacity: 0, y: -20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20, delay: depth * 0.1 }}
                className="relative z-20"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{ zIndex: isHovered ? 50 : 10 }} // Bring hovered node to front
            >
                <div className="relative">
                    <div className={`border-4 ${isHovered ? 'border-primary scale-110' : 'border-white dark:border-slate-800'} bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-full w-20 h-20 flex items-center justify-center shadow-xl transition-all duration-300 cursor-pointer relative`}>
                        <div className="text-center">
                            <p className="font-bold text-primary text-sm">R${node.key}</p>
                            <p className="text-[10px] text-muted-foreground truncate w-14 px-1">{node.value.name}</p>
                        </div>
                    </div>

                    {/* Glow Effect */}
                    <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                </div>

                {/* Balance Factor Badge */}
                <div className={`absolute -top-1 -right-1 w-7 h-7 rounded-full ${getBalanceColor(balance)} border-2 border-white dark:border-slate-800 flex items-center justify-center text-[10px] font-bold text-white shadow-lg z-30`}>
                    {balance}
                </div>

                {/* Info Popover - Improved Positioning */}
                <AnimatePresence>
                    {isHovered && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 5, scale: 0.9 }}
                            className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-56 p-4 bg-slate-900/95 backdrop-blur-xl text-white text-xs rounded-xl shadow-2xl border border-white/10 z-50 pointer-events-none"
                        >
                            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-900/95 rotate-45 border-l border-t border-white/10"></div>
                            <div className="flex items-center gap-2 mb-3 border-b border-white/10 pb-2">
                                <Info size={14} className="text-primary" />
                                <span className="font-bold text-sm">Detalhes do Nó</span>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Produto:</span>
                                    <span className="font-medium text-right truncate max-w-[100px]">{node.value.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Altura:</span>
                                    <span className="font-mono text-primary">{node.height}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Estoque:</span>
                                    <span className="font-mono">{node.value.stock} un</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Fator Bal.:</span>
                                    <span className={`font-mono font-bold ${balance === 0 ? 'text-emerald-400' : Math.abs(balance) === 1 ? 'text-amber-400' : 'text-rose-400'}`}>{balance}</span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {(node.left || node.right) && (
                <div className="flex items-start justify-center pt-12 w-full relative">
                    {/* Connector Lines */}
                    <svg
                        className="absolute top-0 left-0 w-full h-12 overflow-visible pointer-events-none z-0"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                    >
                        <defs>
                            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="currentColor" stopOpacity="0.5" />
                                <stop offset="100%" stopColor="currentColor" stopOpacity="0.2" />
                            </linearGradient>
                        </defs>
                        {/* Main vertical stem */}
                        <path
                            d="M 50 0 L 50 20"
                            stroke={isHovered ? "hsl(var(--primary))" : "currentColor"}
                            strokeWidth={isHovered ? "2" : "1"}
                            vectorEffect="non-scaling-stroke"
                            className={`transition-all duration-300 ${isHovered ? 'text-primary' : 'text-slate-400 dark:text-slate-500'}`}
                            fill="none"
                        />
                        {node.left && (
                            <path
                                d="M 50 20 C 50 60, 25 60, 25 100"
                                stroke={isHovered ? "hsl(var(--primary))" : "currentColor"}
                                strokeWidth={isHovered ? "2" : "1"}
                                vectorEffect="non-scaling-stroke"
                                className={`transition-all duration-300 ${isHovered ? 'text-primary' : 'text-slate-400 dark:text-slate-500'}`}
                                fill="none"
                            />
                        )}
                        {node.right && (
                            <path
                                d="M 50 20 C 50 60, 75 60, 75 100"
                                stroke={isHovered ? "hsl(var(--primary))" : "currentColor"}
                                strokeWidth={isHovered ? "2" : "1"}
                                vectorEffect="non-scaling-stroke"
                                className={`transition-all duration-300 ${isHovered ? 'text-primary' : 'text-slate-400 dark:text-slate-500'}`}
                                fill="none"
                            />
                        )}
                    </svg>

                    <div className="w-1/2 flex justify-center min-w-[120px]">{node.left ? <TreeNode key={node.left.value.id} node={node.left} depth={depth + 1} /> : <div className="w-20" />}</div>
                    <div className="w-1/2 flex justify-center min-w-[120px]">{node.right ? <TreeNode key={node.right.value.id} node={node.right} depth={depth + 1} /> : <div className="w-20" />}</div>
                </div>
            )}
        </div>
    );
};

const AVLTreeViz = ({ root, getHeight, onOptimize }) => {
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const containerRef = useRef(null);

    const handleWheel = (e) => {
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            const delta = e.deltaY * -0.001;
            const newScale = Math.min(Math.max(0.5, scale + delta), 2);
            setScale(newScale);
        }
    };

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    };

    const handleMouseMove = (e) => {
        if (isDragging) {
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const resetView = () => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
    };

    // Count nodes
    const countNodes = (node) => {
        if (!node) return 0;
        return 1 + countNodes(node.left) + countNodes(node.right);
    };

    return (
        <div className="space-y-8">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold font-heading text-foreground">Visualização da Árvore AVL</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Explore a estrutura balanceada da sua árvore de produtos.
                    Use o mouse para arrastar e os controles para ampliar.
                </p>
            </div>

            <Card className="relative h-[600px] overflow-hidden bg-slate-50/50 dark:bg-slate-900/50 border-2 border-dashed group">
                {/* Controls */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 z-50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-2 rounded-lg shadow-lg border border-border/50">
                    <Button variant="ghost" size="icon" onClick={() => setScale(s => Math.min(s + 0.1, 2))} title="Zoom In">
                        <ZoomIn size={18} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setScale(s => Math.max(s - 0.1, 0.5))} title="Zoom Out">
                        <ZoomOut size={18} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={resetView} title="Reset View">
                        <RefreshCw size={18} />
                    </Button>
                    {onOptimize && (
                        <Button variant="ghost" size="icon" onClick={onOptimize} title="Otimizar Balanceamento (Fator 0)">
                            <Maximize size={18} />
                        </Button>
                    )}
                </div>

                <div
                    ref={containerRef}
                    className={`w-full h-full cursor-${isDragging ? 'grabbing' : 'grab'} flex items-center justify-center`}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onWheel={handleWheel}
                >
                    <motion.div
                        style={{
                            scale,
                            x: position.x,
                            y: position.y,
                        }}
                        className="origin-center min-w-max p-20"
                    >
                        {root ? (
                            <TreeNode node={root} />
                        ) : (
                            <div className="flex flex-col items-center justify-center text-muted-foreground opacity-50">
                                <div className="w-20 h-20 border-4 border-current border-dashed rounded-full flex items-center justify-center mb-4 animate-pulse">
                                    <span className="text-3xl font-bold">?</span>
                                </div>
                                <p className="text-lg">Árvore vazia</p>
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-border/50 text-xs space-y-2">
                    <div className="font-bold mb-1">Legenda (Fator de Balanceamento)</div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                        <span>0 (Perfeito)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                        <span>±1 (Aceitável)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                        <span>±2 (Desbalanceado - Rotação)</span>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-primary/5 border-primary/10 hover:bg-primary/10 transition-colors">
                    <CardContent className="p-6 text-center">
                        <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Complexidade</p>
                        <p className="text-3xl font-bold text-primary mt-2">O(log n)</p>
                    </CardContent>
                </Card>
                <Card className="bg-primary/5 border-primary/10 hover:bg-primary/10 transition-colors">
                    <CardContent className="p-6 text-center">
                        <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Altura da Árvore</p>
                        <p className="text-3xl font-bold text-primary mt-2">{getHeight(root)}</p>
                    </CardContent>
                </Card>
                <Card className="bg-primary/5 border-primary/10 hover:bg-primary/10 transition-colors">
                    <CardContent className="p-6 text-center">
                        <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Nós Totais</p>
                        <p className="text-3xl font-bold text-primary mt-2">
                            {countNodes(root)}
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AVLTreeViz;
