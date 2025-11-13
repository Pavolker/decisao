import React, { useState, useCallback, useEffect } from 'react';
import { runSimulation } from './services/geminiService';
import { historyService, type HistoryItem } from './services/historyService';
import type { SimulationResult } from './types';
import ResultsDisplay from './components/ResultsDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import HistoryPanel from './components/HistoryPanel';
import DecisionTemplates from './components/DecisionTemplates';
import ResultsPage from './components/ResultsPage';

const MAX_CHARACTERS = 500;

const App: React.FC = () => {
  const [decisionText, setDecisionText] = useState<string>("O conselho decidiu encerrar o projeto de expansão internacional para concentrar recursos no mercado interno.");
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [showResultsPage, setShowResultsPage] = useState<boolean>(false);

  // Carregar histórico ao montar o componente
  useEffect(() => {
    setHistory(historyService.getAll());
  }, []);

  const handleSimulate = useCallback(async () => {
    if (!decisionText.trim()) {
      setError("Por favor, descreva a decisão a ser simulada.");
      return;
    }

    if (decisionText.length > MAX_CHARACTERS) {
      setError(`A decisão deve ter no máximo ${MAX_CHARACTERS} caracteres.`);
      return;
    }

    setIsLoading(true);
    setError(null);
    setSimulationResult(null);

    try {
      const result = await runSimulation(decisionText);
      setSimulationResult(result);

      // Salvar no histórico
      historyService.save(decisionText, result);
      setHistory(historyService.getAll());

      // Navegar para a página de resultados
      setShowResultsPage(true);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Ocorreu um erro desconhecido.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [decisionText]);

  const handleSelectHistoryItem = useCallback((item: HistoryItem) => {
    setDecisionText(item.decision);
    setSimulationResult(item.result);
    setError(null);
    setShowHistory(false);
    setShowResultsPage(true);
    // Scroll para o topo
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleDeleteHistoryItem = useCallback((id: string) => {
    historyService.delete(id);
    setHistory(historyService.getAll());
  }, []);

  const handleClearHistory = useCallback(() => {
    if (window.confirm('Tem certeza que deseja limpar todo o histórico?')) {
      historyService.clear();
      setHistory([]);
    }
  }, []);

  const handleExportMarkdown = useCallback(() => {
    if (simulationResult && decisionText) {
      historyService.downloadMarkdown(decisionText, simulationResult);
    }
  }, [decisionText, simulationResult]);

  const handleClearForm = useCallback(() => {
    setDecisionText('');
    setSimulationResult(null);
    setError(null);
  }, []);

  const handleBackToHome = useCallback(() => {
    setShowResultsPage(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  
  // Se houver resultado e estiver na página de resultados, mostrar ResultsPage
  if (showResultsPage && simulationResult) {
    return (
      <ResultsPage
        originalDecision={decisionText}
        result={simulationResult}
        onBack={handleBackToHome}
        onExport={handleExportMarkdown}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 font-sans p-4 sm:p-6 lg:p-8">
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        <header className="mb-12 bg-white rounded-xl shadow-md p-8">
          <div className="flex flex-col gap-6 mb-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col items-center gap-4 lg:flex-row lg:items-center lg:gap-6 flex-1">
              <img
                src="/botao.png"
                alt="Logo"
                className="h-16 w-16 md:h-20 md:w-20 object-contain"
              />
              <div className="text-center w-full">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-slate-800 bg-clip-text text-transparent pb-2">
                  Simulador de Decisões Invertidas
                </h1>
                <p className="text-lg md:text-xl font-semibold text-gray-700 mt-1">
                  Projeto Centauro
                </p>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end lg:w-auto">
              <a
                href="https://github.com/Pavolker/ebook-decisao/releases/download/IA/DECISAO.INVERTIDA.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="group text-center"
                title="Baixar Ebook Decisão Invertida"
              >
                <img
                  src="/capa.png"
                  alt="Capa do ebook Decisão Invertida"
                  className="w-28 md:w-32 lg:w-36 rounded-lg shadow-md border border-gray-200 group-hover:shadow-lg transition-shadow"
                />
                <span className="block mt-2 text-sm font-semibold text-blue-700 group-hover:text-blue-900">
                  Baixar Ebook
                </span>
              </a>
            </div>
          </div>
          <p className="mt-3 text-lg text-gray-600 max-w-3xl mx-auto text-center">
            "Avalie o que teria acontecido se a decisão oposta tivesse sido adotada."
          </p>
        </header>

        <main>
          {/* Templates de Decisões */}
          <div className="mb-6">
            <DecisionTemplates onSelectTemplate={setDecisionText} />
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <label htmlFor="decision-input" className="block text-lg font-semibold text-gray-700">
                Descreva brevemente a decisão tomada pelo conselho:
              </label>
              <span className={`text-sm font-medium ${decisionText.length > MAX_CHARACTERS ? 'text-red-600' : 'text-gray-500'}`}>
                {decisionText.length}/{MAX_CHARACTERS}
              </span>
            </div>
            <textarea
              id="decision-input"
              rows={4}
              value={decisionText}
              onChange={(e) => setDecisionText(e.target.value)}
              maxLength={MAX_CHARACTERS}
              placeholder="Ex: Aumentar o investimento em marketing digital em 20% para o próximo trimestre."
              className="w-full p-4 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out text-base text-gray-900 placeholder-gray-400 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
              disabled={isLoading}
            />
            <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={handleClearForm}
                  disabled={isLoading || !decisionText}
                  className="flex-1 sm:flex-none px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                  title="Limpar formulário"
                >
                  Limpar
                </button>
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="flex-1 sm:flex-none px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center justify-center"
                  title="Ver histórico de simulações"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Histórico {history.length > 0 && `(${history.length})`}
                </button>
              </div>
              <button
                onClick={handleSimulate}
                disabled={isLoading || !decisionText.trim()}
                className="flex items-center justify-center w-full sm:w-auto bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform hover:scale-105 disabled:scale-100"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Simulando...
                  </>
                ) : (
                  'Simular Decisão Invertida'
                )}
              </button>
            </div>
          </div>

          {/* Painel de Histórico */}
          {showHistory && (
            <div className="mt-8 animate-fade-in">
              <HistoryPanel
                history={history}
                onSelectItem={handleSelectHistoryItem}
                onDeleteItem={handleDeleteHistoryItem}
                onClearHistory={handleClearHistory}
              />
            </div>
          )}
          
          {error && (
            <div className="mt-8 bg-red-100 border-l-4 border-red-500 text-red-800 p-4 rounded-r-lg" role="alert">
              <p className="font-bold">Ocorreu um Erro</p>
              <p>{error}</p>
            </div>
          )}

          {isLoading && !error && <LoadingSpinner />}

        </main>
        
        <footer className="text-center mt-16 py-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Algoritmo SDI - versão 1.0 - Desenvolvido por PVolker - 2025
          </p>
        </footer>
      </div>
    </div>
  );
};

export default App;
