import React from 'react';
import type { HistoryItem } from '../services/historyService';

interface HistoryPanelProps {
  history: HistoryItem[];
  onSelectItem: (item: HistoryItem) => void;
  onDeleteItem: (id: string) => void;
  onClearHistory: () => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({
  history,
  onSelectItem,
  onDeleteItem,
  onClearHistory,
}) => {
  if (history.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Histórico de Simulações
        </h3>
        <p className="text-gray-500 text-sm">Nenhuma simulação realizada ainda.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Histórico ({history.length})
        </h3>
        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="text-xs text-red-600 hover:text-red-800 font-medium transition-colors"
            title="Limpar todo o histórico"
          >
            Limpar Tudo
          </button>
        )}
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {history.map((item) => (
          <div
            key={item.id}
            className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors cursor-pointer group"
            onClick={() => onSelectItem(item)}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs text-gray-500">
                {new Date(item.timestamp).toLocaleString('pt-BR')}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteItem(item.id);
                }}
                className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity"
                title="Remover"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
            <p className="text-sm text-gray-700 line-clamp-2">
              {item.decision}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryPanel;
