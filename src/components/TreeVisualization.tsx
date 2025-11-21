import mermaid from "mermaid";
import React, { useEffect, useRef, useState } from "react";

// Configuração inicial do Mermaid
mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
  flowchart: {
    useMaxWidth: false,
    htmlLabels: true,
    curve: 'basis',
    padding: 20
  }
});

interface Props {
  treeString: string;
}

export const TreeVisualization: React.FC<Props> = ({ treeString }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (treeString && ref.current) {
      // Limpa o conteúdo anterior
      ref.current.innerHTML = '';

      // Gera ID único para evitar conflitos
      const id = `mermaid-${Date.now()}`;

      try {
        // Renderiza o diagrama Mermaid
        mermaid.render(id, treeString).then(({ svg }) => {
          if (ref.current) {
            ref.current.innerHTML = svg;
          }
        }).catch((error) => {
          console.error('Erro ao renderizar Mermaid:', error);
          if (ref.current) {
            ref.current.innerHTML = `
              <div class="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <p class="text-red-600 font-medium">Erro ao renderizar árvore</p>
                <p class="text-sm text-red-500 mt-2">${error.message}</p>
              </div>
            `;
          }
        });
      } catch (error) {
        console.error('Erro ao processar Mermaid:', error);
        if (ref.current) {
          ref.current.innerHTML = `
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
              <p class="text-yellow-600 font-medium">Não foi possível processar o diagrama</p>
            </div>
          `;
        }
      }
    } else if (!treeString && ref.current) {
      // Mostra mensagem quando não há dados
      ref.current.innerHTML = `
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <div class="text-6xl mb-4">🌳</div>
          <p class="text-gray-600 font-medium">Nenhuma árvore para visualizar</p>
          <p class="text-sm text-gray-500 mt-2">Adicione produtos para gerar a visualização da árvore AVL</p>
        </div>
      `;
    }
  }, [treeString]);

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleResetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
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

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale(prev => Math.max(0.5, Math.min(3, prev + delta)));
  };

  return (
    <div className="relative">
      {/* Controles de Zoom */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 bg-white rounded-lg shadow-lg p-2 border border-gray-200">
        <button
          onClick={handleZoomIn}
          className="p-2 hover:bg-gray-100 rounded transition text-gray-700"
          title="Aumentar zoom (Scroll Up)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
          </svg>
        </button>
        <button
          onClick={handleResetZoom}
          className="p-2 hover:bg-gray-100 rounded transition text-gray-700 text-xs font-medium"
          title="Resetar zoom e posição"
        >
          {Math.round(scale * 100)}%
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 hover:bg-gray-100 rounded transition text-gray-700"
          title="Diminuir zoom (Scroll Down)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
          </svg>
        </button>
      </div>

      {/* Instruções */}
      <div className="absolute bottom-4 left-4 z-10 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg px-4 py-2 border border-gray-200">
        <p className="text-xs text-gray-600">
          🖱️ <strong>Scroll:</strong> Zoom | <strong>Arrastar:</strong> Mover | <strong>Duplo clique:</strong> Resetar
        </p>
      </div>

      {/* Container da Árvore com Pan e Zoom */}
      <div 
        ref={containerRef}
        className="w-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-auto cursor-grab active:cursor-grabbing relative"
        style={{ height: '600px' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onDoubleClick={handleResetZoom}
      >
        <div 
          ref={ref}
          className="transition-transform"
          style={{ 
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: 'top left',
            width: 'max-content',
            padding: '2rem',
            minWidth: '100%'
          }}
        />
      </div>
    </div>
  );
};
