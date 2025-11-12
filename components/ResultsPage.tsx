import React, { useEffect, useState } from 'react';
import type { SimulationResult } from '../types';
import RadarChart from './RadarChart';

interface ResultsPageProps {
  originalDecision: string;
  result: SimulationResult;
  onBack: () => void;
  onExport?: () => void;
}

const ResultsPage: React.FC<ResultsPageProps> = ({ originalDecision, result, onBack, onExport }) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Trigger animation after a short delay
    setTimeout(() => setShowContent(true), 100);
  }, []);

  const impacts = [
    {
      axis: "Econômico",
      real: result.impacts.economic.real,
      inverted: result.impacts.economic.inverted,
      icon: (
        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "from-green-500 to-emerald-600"
    },
    {
      axis: "Operacional",
      real: result.impacts.operational.real,
      inverted: result.impacts.operational.inverted,
      icon: (
        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      color: "from-blue-500 to-indigo-600"
    },
    {
      axis: "Reputacional",
      real: result.impacts.reputational.real,
      inverted: result.impacts.reputational.inverted,
      icon: (
        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      color: "from-purple-500 to-pink-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-slide-down {
          animation: slideDown 0.6s ease-out forwards;
        }
        .animate-slide-up {
          animation: slideUp 0.8s ease-out forwards;
        }
        .animate-fade-in {
          animation: fadeIn 1s ease-out forwards;
        }
        .animate-scale-in {
          animation: scaleIn 0.5s ease-out forwards;
        }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-600 { animation-delay: 0.6s; }
        .delay-700 { animation-delay: 0.7s; }
      `}</style>

      {/* Header com botões de ação */}
      <div className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300 border border-white/20 hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Voltar
            </button>
            <div className="flex items-center gap-3">
              <img
                src="/botao.png"
                alt="Logo"
                className="h-10 w-10 object-contain"
              />
              <span className="text-white font-semibold text-lg hidden sm:inline">SDI</span>
            </div>
            {onExport && (
              <button
                onClick={onExport}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-semibold"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Exportar Relatório
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        {showContent && (
          <div className="text-center mb-16 animate-slide-down">
            <div className="inline-block mb-4 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full border border-blue-400/30">
              <span className="text-sm font-semibold text-blue-300">Resultados da Simulação</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight">
              Análise Completa
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Avaliação detalhada dos impactos da decisão original versus a decisão invertida
            </p>
          </div>
        )}

        {/* Decisão Original - Destaque */}
        {showContent && (
          <div className="mb-12 animate-slide-up opacity-0 delay-200">
            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-2xl p-8 border border-blue-400/20 shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-white">Decisão Original</h2>
              </div>
              <blockquote className="text-2xl md:text-3xl font-medium text-gray-200 italic leading-relaxed">
                "{originalDecision}"
              </blockquote>
            </div>
          </div>
        )}

        {/* Análise das Decisões - Grid */}
        {showContent && (
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Decisão Real */}
            <div className="animate-slide-up opacity-0 delay-300">
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700 shadow-2xl h-full hover:border-blue-500/50 transition-all duration-300">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-700">
                  <div className="p-3 bg-blue-500/20 rounded-xl">
                    <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white">Análise da Decisão Real</h3>
                </div>
                <p className="text-lg text-gray-300 leading-relaxed">{result.realDecision.summary}</p>
              </div>
            </div>

            {/* Decisão Invertida */}
            <div className="animate-slide-up opacity-0 delay-400">
              <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-2xl p-8 border border-purple-500/30 shadow-2xl h-full hover:border-purple-400 transition-all duration-300">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-purple-700/50">
                  <div className="p-3 bg-purple-500/20 rounded-xl">
                    <svg className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white">Decisão Invertida</h3>
                </div>
                <p className="text-lg text-gray-300 leading-relaxed">{result.invertedDecision.summary}</p>
              </div>
            </div>
          </div>
        )}

        {/* Impactos Prováveis - Cards Visuais */}
        {showContent && (
          <div className="mb-12 animate-slide-up opacity-0 delay-500">
            <h2 className="text-4xl font-bold text-center mb-8 text-white">
              Comparação de Impactos
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {impacts.map((impact, index) => (
                <div
                  key={index}
                  className={`animate-scale-in opacity-0 delay-${(index + 6) * 100}`}
                >
                  <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 shadow-2xl hover:scale-105 transition-all duration-300">
                    {/* Ícone e Título */}
                    <div className={`bg-gradient-to-r ${impact.color} p-4 rounded-xl mb-6 flex items-center justify-center`}>
                      <div className="text-white">
                        {impact.icon}
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-center mb-6 text-white">
                      {impact.axis}
                    </h3>

                    {/* Decisão Real */}
                    <div className="mb-4 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                      <div className="text-sm font-semibold text-blue-400 mb-2">Decisão Real</div>
                      <p className="text-gray-300 text-sm leading-relaxed">{impact.real}</p>
                    </div>

                    {/* Decisão Invertida */}
                    <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                      <div className="text-sm font-semibold text-purple-400 mb-2">Decisão Invertida</div>
                      <p className="text-gray-300 text-sm leading-relaxed">{impact.inverted}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Gráfico Radar - Análise Visual */}
        {showContent && result.radarMetrics && (
          <div className="animate-slide-up opacity-0 delay-600">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700 shadow-2xl">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-white mb-3">
                  Análise Comparativa Visual
                </h2>
                <p className="text-gray-300 text-lg">
                  Visualize graficamente as diferenças entre as duas decisões em 6 dimensões estratégicas
                </p>
              </div>
              <RadarChart
                realData={result.radarMetrics.real}
                invertedData={result.radarMetrics.inverted}
              />
            </div>
          </div>
        )}

        {/* Narrativa Estratégica - Destaque Final */}
        {showContent && (
          <div className="animate-slide-up opacity-0 delay-700">
            <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-red-500/10 backdrop-blur-sm rounded-2xl p-10 border border-amber-400/20 shadow-2xl">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-amber-500/20">
                <div className="p-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl">
                  <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-4xl font-bold text-white">Narrativa Estratégica</h2>
              </div>
              <div className="space-y-6">
                {result.strategicNarrative.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-xl text-gray-200 leading-relaxed">
                    {paragraph.trim()}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-12 border-t border-white/10">
        <p className="text-center text-gray-400">
          Algoritmo SDI - versão 1.0 - Desenvolvido por PVolker - 2025
        </p>
      </div>
    </div>
  );
};

export default ResultsPage;
