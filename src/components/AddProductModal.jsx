import React, { useState } from 'react';
import { Modal } from './ui/Modal';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Plus } from 'lucide-react';

const AddProductModal = ({ isOpen, onClose, onAdd, onBulkAdd }) => {
    const [activeTab, setActiveTab] = useState('single');
    const [singleForm, setSingleForm] = useState({ name: '', price: '', stock: '', image: '' });
    const [bulkInput, setBulkInput] = useState('');

    const handleSingleSubmit = (e) => {
        e.preventDefault();
        if (!singleForm.name || !singleForm.price) return;

        onAdd({
            name: singleForm.name,
            price: parseFloat(singleForm.price),
            stock: parseInt(singleForm.stock) || 0,
            image: singleForm.image
        });
        setSingleForm({ name: '', price: '', stock: '', image: '' });
        onClose();
    };

    const handleBulkSubmit = () => {
        const lines = bulkInput.split('\n');
        const newProducts = lines.map(line => {
            const parts = line.split(',');
            if (parts.length >= 2) {
                return {
                    id: Date.now() + Math.random(),
                    name: parts[0].trim(),
                    price: parseFloat(parts[1].trim()) || 0,
                    stock: parseInt(parts[2]?.trim()) || 0,
                    image: parts[3]?.trim() || ''
                };
            }
            return null;
        }).filter(p => p !== null);

        onBulkAdd(newProducts);
        setBulkInput('');
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Adicionar Produto"
            className={activeTab === 'bulk' ? "max-w-4xl" : "max-w-lg"}
        >
            <div className="flex gap-2 mb-4 p-1 bg-muted rounded-lg">
                <button
                    onClick={() => setActiveTab('single')}
                    className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'single' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                        }`}
                >
                    Unitário
                </button>
                <button
                    onClick={() => setActiveTab('bulk')}
                    className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'bulk' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                        }`}
                >
                    Em Lote
                </button>
            </div>

            {activeTab === 'single' ? (
                <form onSubmit={handleSingleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Nome do Produto</label>
                        <Input
                            placeholder="Ex: Teclado Mecânico"
                            value={singleForm.name}
                            onChange={e => setSingleForm({ ...singleForm, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">URL da Imagem</label>
                        <Input
                            placeholder="https://exemplo.com/imagem.jpg"
                            value={singleForm.image}
                            onChange={e => setSingleForm({ ...singleForm, image: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Preço (R$)</label>
                            <Input
                                type="number"
                                placeholder="0.00"
                                step="0.01"
                                value={singleForm.price}
                                onChange={e => setSingleForm({ ...singleForm, price: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Estoque</label>
                            <Input
                                type="number"
                                placeholder="0"
                                value={singleForm.stock}
                                onChange={e => setSingleForm({ ...singleForm, stock: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="pt-4 flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                        <Button type="submit">Adicionar Produto</Button>
                    </div>
                </form>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <div className="space-y-4 md:col-span-4">
                        <div className="space-y-2">
                            <h3 className="text-sm font-medium">Instruções</h3>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Adicione múltiplos produtos de uma vez colando os dados no formato CSV.
                            </p>
                            <div className="p-3 bg-muted/50 rounded-md border border-border/50">
                                <p className="text-xs font-mono font-medium text-foreground mb-1">Formato:</p>
                                <p className="text-xs font-mono text-muted-foreground">Nome, Preço, Estoque, URL Imagem</p>
                            </div>
                            <div className="p-3 bg-muted/50 rounded-md border border-border/50">
                                <p className="text-xs font-mono font-medium text-foreground mb-1">Exemplo:</p>
                                <p className="text-xs font-mono text-muted-foreground whitespace-pre">
                                    Monitor, 1200, 5, https://...<br />
                                    Mouse, 150, 20, https://...
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4 md:col-span-8 flex flex-col">
                        <div className="space-y-2 flex-1 flex flex-col">
                            <label className="text-sm font-medium">Dados (CSV)</label>
                            <textarea
                                className="flex-1 min-h-[300px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
                                placeholder="Cole seus dados aqui..."
                                value={bulkInput}
                                onChange={e => setBulkInput(e.target.value)}
                            />
                        </div>
                        <div className="pt-2 flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                            <Button onClick={handleBulkSubmit} className="gap-2">
                                <Plus size={16} /> Adicionar em Lote
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default AddProductModal;
