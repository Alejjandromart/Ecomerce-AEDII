import React, { useState } from 'react';
import { Search, ArrowUpDown, Trash2, Plus, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

const ProductCatalog = ({ products, onRemove, onAddClick, onClearAll }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'price', direction: 'asc' });

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedProducts = [...products]
        .filter(p => {
            const term = searchTerm.toLowerCase();
            const matchesName = p.name.toLowerCase().includes(term);
            const matchesId = p.id.toString().includes(searchTerm);
            return matchesName || matchesId;
        })
        .sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
            if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-heading text-foreground">Catálogo de Produtos</h1>
                    <p className="text-muted-foreground mt-1">Gerencie seu inventário e visualize preços.</p>
                </div>
                <div className="flex gap-2">
                    {products.length > 0 && (
                        <Button 
                            onClick={() => {
                                if (window.confirm('Tem certeza que deseja remover todos os produtos?')) {
                                    onClearAll();
                                }
                            }} 
                            variant="outline" 
                            className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                            <Trash2 size={18} /> Limpar Tudo
                        </Button>
                    )}
                    <Button onClick={onAddClick} className="gap-2 shadow-lg shadow-primary/25">
                        <Plus size={18} /> Novo Produto
                    </Button>
                </div>
            </div>

            <Card className="border-none shadow-lg bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                        <div className="relative w-full md:w-96 group">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                            <Input
                                type="text"
                                placeholder="Buscar por nome ou ID..."
                                className="pl-10 bg-background/50 border-transparent focus:border-primary/20 focus:bg-background transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleSort('price')}
                                className={`gap-2 ${sortConfig.key === 'price' ? 'border-primary/50 bg-primary/5 text-primary' : ''}`}
                            >
                                Preço <ArrowUpDown size={14} />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleSort('stock')}
                                className={`gap-2 ${sortConfig.key === 'stock' ? 'border-primary/50 bg-primary/5 text-primary' : ''}`}
                            >
                                Estoque <ArrowUpDown size={14} />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {sortedProducts.map((product) => (
                        <motion.div
                            key={product.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Card className="overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 border-transparent hover:border-primary/20 group h-full flex flex-col">
                                {product.image && (
                                    <div className="relative h-48 w-full overflow-hidden bg-muted/50 border-b border-border/50">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            onError={(e) => {
                                                e.target.style.display = 'none'; // Hide if broken
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>
                                )}
                                <CardContent className="p-6 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1" title={product.name}>{product.name}</h3>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${product.stock > 0
                                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                                                }`}>
                                                {product.stock > 0 ? `${product.stock} em estoque` : 'Esgotado'}
                                            </span>
                                        </div>
                                        <div className="h-8 w-8 rounded-full bg-primary/5 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                                            #{product.id.toString().slice(-3)}
                                        </div>
                                    </div>

                                    <div className="mt-auto flex items-end justify-between pt-4">
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Preço Unitário</p>
                                            <p className="text-2xl font-bold text-foreground mt-1">
                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                                            </p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onRemove(product.id)}
                                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0"
                                        >
                                            <Trash2 size={18} />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {sortedProducts.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                        <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mb-4">
                            <Search className="text-muted-foreground" size={32} />
                        </div>
                        <h3 className="text-lg font-medium text-foreground">Nenhum produto encontrado</h3>
                        <p className="text-muted-foreground max-w-sm mt-2">Tente ajustar seus filtros ou adicione um novo produto ao catálogo.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductCatalog;
