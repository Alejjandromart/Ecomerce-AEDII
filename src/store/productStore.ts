import { create } from 'zustand';
import { Product } from '../types/product';

interface StoreState {
    produtos: Product[];
    treeAVL: string;
    stats: object;
    setProdutos: (produtos: Product[]) => void;
    setTreeAVL: (treeAVL: string) => void;
    setStats: (stats: object) => void;
}
export const useProductStore = create<StoreState>((set) => ({
    produtos: [],
    treeAVL: "",
    stats: {},
    setProdutos: (produtos: Product[]) => set({ produtos }),
    setTreeAVL: (treeAVL: string) => set({ treeAVL }),
    setStats: (stats: object) => set({ stats }),
}));