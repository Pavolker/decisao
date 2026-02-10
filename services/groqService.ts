import type { SimulationResult } from '../types';

const API_URL = '/api/openai';
const MAX_RETRIES = 2;

function extractJson(text: string): SimulationResult {
  try {
    return JSON.parse(text) as SimulationResult;
  } catch {
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start >= 0 && end > start) {
      const slice = text.slice(start, end + 1);
      return JSON.parse(slice) as SimulationResult;
    }
    throw new Error('Erro ao processar a resposta da API. Tente novamente.');
  }
}

export const runSimulation = async (decisionText: string): Promise<SimulationResult> => {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: decisionText })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Falha na requisição');
      }

      const data = await response.json();
      if (!data?.text) {
        throw new Error('Resposta inválida da API.');
      }

      return extractJson(data.text);
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error('Erro desconhecido');
      lastError = error;

      const message = error.message.toLowerCase();
      if (
        message.includes('overloaded') ||
        message.includes('unavailable') ||
        message.includes('timeout')
      ) {
        await new Promise((resolve) => setTimeout(resolve, 500 * Math.pow(2, attempt)));
        continue;
      }

      if (message.includes('api key') || message.includes('nao configurada')) {
        throw new Error('Chave de API não configurada. Verifique as variáveis do Netlify.');
      }
      if (message.includes('quota')) {
        throw new Error('Limite de quota da API atingido. Tente novamente mais tarde.');
      }
      if (message.includes('rate limit')) {
        throw new Error('Muitas requisições. Aguarde alguns segundos e tente novamente.');
      }
      if (message.includes('network') || message.includes('fetch')) {
        throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
      }

      throw error;
    }
  }

  throw lastError || new Error('Modelo sobrecarregado. Tente novamente em alguns segundos.');
};
