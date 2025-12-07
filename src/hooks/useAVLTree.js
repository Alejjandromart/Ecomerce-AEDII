import { useState, useEffect, useCallback } from 'react';

class AVLNode {
    constructor(product) {
        this.key = product.price;
        this.value = product;
        this.left = null;
        this.right = null;
        this.height = 1;
    }
}

const getHeight = (node) => (node ? node.height : 0);
const getBalance = (node) => (node ? getHeight(node.left) - getHeight(node.right) : 0);

const rightRotate = (y) => {
    const x = y.left;
    const T2 = x.right;
    x.right = y;
    y.left = T2;
    y.height = Math.max(getHeight(y.left), getHeight(y.right)) + 1;
    x.height = Math.max(getHeight(x.left), getHeight(x.right)) + 1;
    return x;
};

const leftRotate = (x) => {
    const y = x.right;
    const T2 = y.left;
    y.left = x;
    x.right = T2;
    x.height = Math.max(getHeight(x.left), getHeight(x.right)) + 1;
    y.height = Math.max(getHeight(y.left), getHeight(y.right)) + 1;
    return y;
};

const insertAVL = (node, product) => {
    if (!node) return new AVLNode(product);

    if (product.price < node.key) {
        node.left = insertAVL(node.left, product);
    } else if (product.price > node.key) {
        node.right = insertAVL(node.right, product);
    } else {
        // Price is equal
        if (node.value.name === product.name) {
            // Same price and name: update existing node value but don't create new node
            node.value = product;
            return node;
        }
        // Same price, different name: insert to right
        node.right = insertAVL(node.right, product);
    }

    node.height = 1 + Math.max(getHeight(node.left), getHeight(node.right));
    const balance = getBalance(node);

    // Left Left Case
    if (balance > 1 && product.price < node.left.key) return rightRotate(node);
    
    // Right Right Case (includes duplicates >=)
    if (balance < -1 && product.price >= node.right.key) return leftRotate(node);
    
    // Left Right Case
    if (balance > 1 && product.price >= node.left.key) {
        node.left = leftRotate(node.left);
        return rightRotate(node);
    }
    
    // Right Left Case
    if (balance < -1 && product.price < node.right.key) {
        node.right = rightRotate(node.right);
        return leftRotate(node);
    }

    return node;
};

export const useAVLTree = (initialProducts = []) => {
    // Initialize from localStorage or use initialProducts
    const [products, setProducts] = useState(() => {
        const saved = localStorage.getItem('avl-products');
        return saved ? JSON.parse(saved) : initialProducts;
    });
    const [avlRoot, setAvlRoot] = useState(null);

    // Persist to localStorage whenever products change
    useEffect(() => {
        localStorage.setItem('avl-products', JSON.stringify(products));
    }, [products]);

    // Sync across tabs
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'avl-products') {
                setProducts(JSON.parse(e.newValue));
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    useEffect(() => {
        let root = null;
        products.forEach(p => {
            root = insertAVL(root, p);
        });
        setAvlRoot(root);
    }, [products]);

    const addProduct = useCallback((product) => {
        setProducts(prev => [...prev, { ...product, id: Date.now() + Math.random() }]);
    }, []);

    const removeProduct = useCallback((id) => {
        setProducts(prev => prev.filter(p => p.id !== id));
    }, []);

    const addBulkProducts = useCallback((newProducts) => {
        setProducts(prev => [...prev, ...newProducts]);
    }, []);

    const runStressTest = useCallback((count = 1000) => {
        const startTime = performance.now();
        let root = null;
        const testProducts = [];

        // Generation Phase
        for (let i = 0; i < count; i++) {
            testProducts.push({
                id: i,
                name: `Product ${i}`,
                price: Math.floor(Math.random() * 10000),
                stock: Math.floor(Math.random() * 100)
            });
        }
        const genTime = performance.now() - startTime;

        // Insertion Phase
        const insertStart = performance.now();
        testProducts.forEach(p => {
            root = insertAVL(root, p);
        });
        const insertTime = performance.now() - insertStart;

        // Search Phase (Search for 10% of items)
        const searchStart = performance.now();
        const searchCount = Math.floor(count * 0.1);
        for (let i = 0; i < searchCount; i++) {
            const targetPrice = testProducts[Math.floor(Math.random() * count)].price;
            // Simple BST search simulation
            let current = root;
            while (current) {
                if (targetPrice < current.key) current = current.left;
                else if (targetPrice > current.key) current = current.right;
                else break;
            }
        }
        const searchTime = performance.now() - searchStart;

        // --- List Comparison ---

        // List Insertion
        const listInsertStart = performance.now();
        const list = [];
        testProducts.forEach(p => list.push(p));
        const listInsertTime = performance.now() - listInsertStart;

        // List Search
        const listSearchStart = performance.now();
        for (let i = 0; i < searchCount; i++) {
            const targetPrice = testProducts[Math.floor(Math.random() * count)].price;
            // Linear search
            list.find(p => p.price === targetPrice);
        }
        const listSearchTime = performance.now() - listSearchStart;

        return {
            count,
            genTime,
            insertTime,
            searchTime,
            listInsertTime,
            listSearchTime,
            height: getHeight(root)
        };
    }, []);

    const optimizeTree = useCallback(() => {
        if (!avlRoot) return;

        // Extract nodes in order
        const nodes = [];
        const inOrder = (node) => {
            if (!node) return;
            inOrder(node.left);
            nodes.push(node.value);
            inOrder(node.right);
        };
        inOrder(avlRoot);

        // Build perfect BST
        const buildPerfectBST = (items) => {
            if (items.length === 0) return null;
            const mid = Math.floor(items.length / 2);
            const node = new AVLNode(items[mid]);
            node.left = buildPerfectBST(items.slice(0, mid));
            node.right = buildPerfectBST(items.slice(mid + 1));
            node.height = 1 + Math.max(getHeight(node.left), getHeight(node.right));
            return node;
        };

        const newRoot = buildPerfectBST(nodes);
        setAvlRoot(newRoot);
    }, [avlRoot]);

    return {
        products,
        avlRoot,
        addProduct,
        removeProduct,
        addBulkProducts,
        getHeight,
        getBalance,
        runStressTest,
        optimizeTree
    };
};
