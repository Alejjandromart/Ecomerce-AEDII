import React, { useState } from 'react';
import Layout from './components/Layout';
import ProductCatalog from './components/ProductCatalog';
import AVLTreeViz from './components/AVLTreeViz';
import PerformanceDashboard from './components/PerformanceDashboard';
import AddProductModal from './components/AddProductModal';
import { useAVLTree } from './hooks/useAVLTree';

export default function App() {
  const [activeTab, setActiveTab] = useState('catalog');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    products,
    avlRoot,
    addProduct,
    removeProduct,
    addBulkProducts,
    getHeight,
    runStressTest,
    optimizeTree
  } = useAVLTree([
    { id: 1, name: "Teclado Mecânico", price: 250, stock: 15 },
    { id: 2, name: "Mouse Gamer", price: 120, stock: 30 },
    { id: 3, name: "Monitor 24'", price: 800, stock: 5 },
  ]);

  const handleBulkAdd = (newProducts) => {
    addBulkProducts(newProducts);
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'catalog' && (
        <ProductCatalog
          products={products}
          onRemove={removeProduct}
          onAddClick={() => setIsModalOpen(true)}
        />
      )}

      {activeTab === 'avl' && (
        <AVLTreeViz
          root={avlRoot}
          getHeight={getHeight}
          onOptimize={optimizeTree}
        />
      )}

      {activeTab === 'performance' && (
        <PerformanceDashboard
          runStressTest={runStressTest}
        />
      )}

      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addProduct}
        onBulkAdd={handleBulkAdd}
      />
    </Layout>
  );
}
