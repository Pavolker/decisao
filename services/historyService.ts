import type { SimulationResult } from '../types';

export interface HistoryItem {
  id: string;
  timestamp: number;
  decision: string;
  result: SimulationResult;
}

const STORAGE_KEY = 'simulation_history';
const MAX_HISTORY_ITEMS = 10;

export const historyService = {
  // Salvar nova simulação no histórico
  save(decision: string, result: SimulationResult): void {
    try {
      const history = this.getAll();
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        decision,
        result,
      };

      // Adicionar no início e limitar a MAX_HISTORY_ITEMS
      const updatedHistory = [newItem, ...history].slice(0, MAX_HISTORY_ITEMS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Error saving to history:', error);
    }
  },

  // Obter todo o histórico
  getAll(): HistoryItem[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading history:', error);
      return [];
    }
  },

  // Obter item específico por ID
  getById(id: string): HistoryItem | null {
    const history = this.getAll();
    return history.find(item => item.id === id) || null;
  },

  // Deletar item específico
  delete(id: string): void {
    try {
      const history = this.getAll();
      const filtered = history.filter(item => item.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting from history:', error);
    }
  },

  // Limpar todo o histórico
  clear(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  },

  // Exportar resultado como markdown
  exportAsMarkdown(decision: string, result: SimulationResult): string {
    const now = new Date().toLocaleString('pt-BR');

    return `# Simulação de Decisão Invertida
**Data:** ${now}

---

## 1. Decisão Original
"${decision}"

### Análise da Decisão Real
${result.realDecision.summary}

---

## 2. Decisão Invertida
${result.invertedDecision.summary}

---

## 3. Impactos Prováveis

### Econômico
- **Decisão Real:** ${result.impacts.economic.real}
- **Decisão Invertida:** ${result.impacts.economic.inverted}

### Operacional
- **Decisão Real:** ${result.impacts.operational.real}
- **Decisão Invertida:** ${result.impacts.operational.inverted}

### Reputacional
- **Decisão Real:** ${result.impacts.reputational.real}
- **Decisão Invertida:** ${result.impacts.reputational.inverted}

---

## 4. Narrativa Estratégica
${result.strategicNarrative}

---

*Gerado pelo Simulador de Decisões Invertidas — Algoritmo SDI v1.0*
`;
  },

  // Download do markdown
  downloadMarkdown(decision: string, result: SimulationResult): void {
    const markdown = this.exportAsMarkdown(decision, result);
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `simulacao-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },
};
