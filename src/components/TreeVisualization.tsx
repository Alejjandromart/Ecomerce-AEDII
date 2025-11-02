import mermaid from "mermaid";
import React, { useEffect, useRef } from "react";

// Configuração inicial do Mermaid
mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
  flowchart: {
    useMaxWidth: true,
    htmlLabels: true,
    curve: 'basis'
  }
});

interface Props {
  treeString: string;
}

export const TreeVisualization: React.FC<Props> = ({ treeString }) => {
  const ref = useRef<HTMLDivElement>(null);

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

  return (
    <div 
      ref={ref} 
      className="w-full overflow-auto bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      style={{ minHeight: '400px' }}
    />
  );
};
