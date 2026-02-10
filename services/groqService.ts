import type { SimulationResult } from '../types';

const API_URL = '/api/openai';
const MAX_RETRIES = 2;

function sanitizeJson(text: string): string {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end <= start) {
    throw new Error('Erro ao processar a resposta da API. Tente novamente.');
  }
  const slice = text.slice(start, end + 1);

  let out = '';
  let inString = false;
  let escaped = false;

  for (let i = 0; i < slice.length; i += 1) {
    const ch = slice[i];
    if (escaped) {
      out += ch;
      escaped = false;
      continue;
    }
    if (ch === '\\\\') {
      out += ch;
      escaped = true;
      continue;
    }
    if (ch === '\"') {
      inString = !inString;
      out += ch;
      continue;
    }
    if (inString && (ch === '\\n' || ch === '\\r')) {
      out += '\\\\n';
      continue;
    }
    out += ch;
  }

  return out;
}

function extractJson(text: string): SimulationResult {
  try {
    return JSON.parse(text) as SimulationResult;
  } catch {
    const cleaned = sanitizeJson(text);
    return JSON.parse(cleaned) as SimulationResult;
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
