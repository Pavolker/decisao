import React from 'react';
import type { SimulationResult } from '../types';

interface ResultsDisplayProps {
  originalDecision: string;
  result: SimulationResult;
  onExport?: () => void;
}

const getIconForTitle = (title: string) => {
    switch (title) {
        case "1. Decisão Original":
            return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>;
        case "2. Decisão Invertida":
            return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 4l16 16" /></svg>;
        case "3. Impactos Prováveis":
            return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
        case "4. Narrativa Estratégica":
            return <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 16.382V5.618a1 1 0 00-1.447-.894L15 7m0 13V7m0 6l6-3" /></svg>;
        default:
            return null;
    }
}


const InfoCard: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
  <div className={`bg-white p-6 rounded-xl shadow-md border border-gray-200 ${className}`}>
    <div className="flex items-center border-b-2 border-gray-100 pb-3 mb-4">
        {getIconForTitle(title)}
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
    </div>
    <div className="text-gray-700 space-y-3 text-base leading-relaxed">{children}</div>
  </div>
);


const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ originalDecision, result, onExport }) => {
  const impacts = [
    {
      axis: "Econômico",
      real: result.impacts.economic.real,
      inverted: result.impacts.economic.inverted,
    },
    {
      axis: "Operacional",
      real: result.impacts.operational.real,
      inverted: result.impacts.operational.inverted,
    },
    {
      axis: "Reputacional",
      real: result.impacts.reputational.real,
      inverted: result.impacts.reputational.inverted,
    }
  ];

  return (
    <div className="mt-10 space-y-8 animate-fade-in">
      {/* Cabeçalho com botão de exportar */}
      {onExport && (
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Resultados da Simulação</h2>
          <button
            onClick={onExport}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md hover:shadow-lg font-medium text-sm"
            title="Exportar como Markdown"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Exportar Markdown
          </button>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        {/* Coluna 1: Decisão Real */}
        <div className="space-y-6 flex flex-col">
            <InfoCard title="1. Decisão Original">
                <p className="italic text-gray-600 bg-gray-50 p-4 rounded-lg">"{originalDecision}"</p>
            </InfoCard>
            <InfoCard title="Análise da Decisão Real" className="flex-grow">
                <p>{result.realDecision.summary}</p>
            </InfoCard>
        </div>

        {/* Coluna 2: Decisão Invertida */}
        <div className="space-y-6 flex flex-col">
            <InfoCard title="2. Decisão Invertida" className="flex-grow">
                <p>{result.invertedDecision.summary}</p>
            </InfoCard>
        </div>
      </div>

      {/* 3. Impactos Prováveis */}
      <InfoCard title="3. Impactos Prováveis" className="overflow-x-auto">
        <div className="w-full">
            <table className="w-full text-left border-collapse">
            <thead>
                <tr>
                <th className="p-4 text-sm font-semibold text-gray-600 bg-gray-100 rounded-tl-lg">Eixo</th>
                <th className="p-4 text-sm font-semibold text-gray-600 bg-gray-100">Decisão Real</th>
                <th className="p-4 text-sm font-semibold text-gray-600 bg-gray-100 rounded-tr-lg">Decisão Invertida</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
                {impacts.map((item, index) => (
                <tr key={index}>
                    <td className="p-4 font-semibold text-gray-800">{item.axis}</td>
                    <td className="p-4 text-gray-700">{item.real}</td>
                    <td className="p-4 text-gray-700">{item.inverted}</td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
      </InfoCard>
      
      {/* 4. Narrativa Estratégica */}
      <InfoCard title="4. Narrativa Estratégica">
        <p>{result.strategicNarrative}</p>
      </InfoCard>
    </div>
  );
};

export default ResultsDisplay;