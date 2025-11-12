import React, { useState } from 'react';

interface Template {
  id: string;
  category: string;
  title: string;
  decision: string;
}

const templates: Template[] = [
  {
    id: 't1',
    category: 'Estratégia',
    title: 'Expansão Internacional',
    decision: 'O conselho decidiu expandir operações para mercados internacionais, começando pela América Latina, com investimento inicial de 5 milhões de dólares.',
  },
  {
    id: 't2',
    category: 'Recursos Humanos',
    title: 'Trabalho Remoto',
    decision: 'A empresa decidiu implementar modelo de trabalho 100% remoto permanentemente, eliminando todos os escritórios físicos e redirecionando o orçamento para tecnologia.',
  },
  {
    id: 't3',
    category: 'Produto',
    title: 'Nova Linha Premium',
    decision: 'Decidimos lançar uma linha premium de produtos com preços 40% acima da média do mercado, focando em qualidade e exclusividade.',
  },
  {
    id: 't4',
    category: 'Marketing',
    title: 'Marketing Digital',
    decision: 'O orçamento de marketing foi redirecionado 100% para canais digitais, descontinuando todas as campanhas de mídia tradicional (TV, rádio, outdoor).',
  },
  {
    id: 't5',
    category: 'Finanças',
    title: 'Corte de Custos',
    decision: 'Para manter a rentabilidade, o conselho aprovou redução de 25% da força de trabalho e congelamento de salários por 18 meses.',
  },
  {
    id: 't6',
    category: 'Tecnologia',
    title: 'Migração para Cloud',
    decision: 'Decidimos migrar 100% da infraestrutura de TI para cloud computing, descontinuando servidores locais nos próximos 12 meses.',
  },
];

interface DecisionTemplatesProps {
  onSelectTemplate: (decision: string) => void;
}

const DecisionTemplates: React.FC<DecisionTemplatesProps> = ({ onSelectTemplate }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="w-full bg-blue-50 border border-blue-200 text-blue-700 font-medium py-2 px-4 rounded-lg hover:bg-blue-100 transition-colors text-sm flex items-center justify-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
        Ver Templates de Decisões
      </button>
    );
  }

  const categories = Array.from(new Set(templates.map(t => t.category)));

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-sm font-semibold text-blue-900 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          Templates de Decisões
        </h4>
        <button
          onClick={() => setIsExpanded(false)}
          className="text-blue-600 hover:text-blue-800 text-xs font-medium"
        >
          Ocultar
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => {
              onSelectTemplate(template.decision);
              setIsExpanded(false);
            }}
            className="bg-white p-3 rounded-lg border border-blue-200 hover:border-blue-400 hover:shadow-md transition-all text-left group"
          >
            <div className="flex items-start justify-between mb-2">
              <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded">
                {template.category}
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400 group-hover:text-blue-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <h5 className="text-sm font-semibold text-gray-800 mb-1">
              {template.title}
            </h5>
            <p className="text-xs text-gray-600 line-clamp-2">
              {template.decision}
            </p>
          </button>
        ))}
      </div>

      <p className="text-xs text-blue-700 mt-3 text-center">
        Clique em um template para usar como ponto de partida
      </p>
    </div>
  );
};

export default DecisionTemplates;
