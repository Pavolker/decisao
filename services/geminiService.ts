
import { GoogleGenAI, Type } from "@google/genai";
import type { SimulationResult } from '../types';

/**
 * ⚠️ AVISO DE SEGURANÇA:
 * Esta aplicação expõe a chave da API Gemini no código do cliente (navegador).
 * Isso é aceitável apenas para desenvolvimento/demonstração.
 *
 * Para produção, recomenda-se:
 * 1. Criar um backend/proxy para proteger a chave da API
 * 2. Implementar rate limiting e autenticação de usuários
 * 3. Usar restrições de domínio na configuração da API key do Google Cloud
 */
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("VITE_GEMINI_API_KEY não configurada. Em desenvolvimento, defina em .env.local; em produção, configure nas variáveis de ambiente do provedor (Netlify).");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });
const modelsOrder = ['gemini-2.5-flash', 'gemini-2.0-flash-lite', 'gemini-1.5-flash'];
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const schema = {
  type: Type.OBJECT,
  properties: {
    realDecision: {
      type: Type.OBJECT,
      description: "Análise da decisão original.",
      properties: {
        summary: { 
          type: Type.STRING, 
          description: 'Resumo semântico conciso da decisão original (quem, o quê, por quê) em 100-150 palavras.' 
        },
      },
      required: ['summary']
    },
    invertedDecision: {
      type: Type.OBJECT,
      description: "Construção da decisão invertida.",
      properties: {
        summary: { 
          type: Type.STRING, 
          description: 'A versão oposta/invertida da decisão, formulada de forma clara e coerente com o contexto, em 100-150 palavras.' 
        },
      },
      required: ['summary']
    },
    impacts: {
      type: Type.OBJECT,
      description: "Tabela comparativa de impactos prováveis.",
      properties: {
        economic: {
          type: Type.OBJECT,
          properties: {
            real: { type: Type.STRING, description: 'Indicador qualitativo do impacto econômico da decisão real (ex: "Estabilidade de curto prazo").' },
            inverted: { type: Type.STRING, description: 'Indicador qualitativo do impacto econômico da decisão invertida (ex: "Crescimento de longo prazo com risco ampliado").' }
          },
          required: ['real', 'inverted']
        },
        operational: {
          type: Type.OBJECT,
          properties: {
            real: { type: Type.STRING, description: 'Indicador qualitativo do impacto operacional da decisão real.' },
            inverted: { type: Type.STRING, description: 'Indicador qualitativo do impacto operacional da decisão invertida.' }
          },
          required: ['real', 'inverted']
        },
        reputational: {
          type: Type.OBJECT,
          properties: {
            real: { type: Type.STRING, description: 'Indicador qualitativo do impacto reputacional da decisão real.' },
            inverted: { type: Type.STRING, description: 'Indicador qualitativo do impacto reputacional da decisão invertida.' }
          },
          required: ['real', 'inverted']
        },
      },
      required: ['economic', 'operational', 'reputational']
    },
    strategicNarrative: {
      type: Type.STRING,
      description: 'Uma análise comparativa final, em tom analítico, sintetizando as implicações estratégicas de ambas as decisões. IMPORTANTE: Deve ser formatada em pelo menos 3 parágrafos separados por quebras de linha duplas (\\n\\n). Primeiro parágrafo: contexto e análise geral. Segundo parágrafo: comparação detalhada dos impactos. Terceiro parágrafo: conclusão sobre qual perfil de risco cada decisão representa e recomendações.'
    },
    radarMetrics: {
      type: Type.OBJECT,
      description: "Métricas numéricas (0-10) para visualização em gráfico radar comparativo.",
      properties: {
        real: {
          type: Type.OBJECT,
          description: "Scores da decisão real em 6 dimensões (escala 0-10, onde 10 é o melhor resultado).",
          properties: {
            financial: { type: Type.NUMBER, description: "Impacto financeiro/econômico (0-10): retorno financeiro, rentabilidade, economia de custos." },
            operational: { type: Type.NUMBER, description: "Eficiência operacional (0-10): produtividade, processos, recursos." },
            reputation: { type: Type.NUMBER, description: "Reputação/imagem (0-10): percepção de stakeholders, marca, confiança." },
            risk: { type: Type.NUMBER, description: "Gestão de risco (0-10): controle de riscos, segurança, previsibilidade. Quanto maior, menor o risco." },
            innovation: { type: Type.NUMBER, description: "Inovação (0-10): capacidade de inovar, adaptação, competitividade futura." },
            sustainability: { type: Type.NUMBER, description: "Sustentabilidade de longo prazo (0-10): viabilidade a longo prazo, responsabilidade, legado." }
          },
          required: ['financial', 'operational', 'reputation', 'risk', 'innovation', 'sustainability']
        },
        inverted: {
          type: Type.OBJECT,
          description: "Scores da decisão invertida em 6 dimensões (escala 0-10, onde 10 é o melhor resultado).",
          properties: {
            financial: { type: Type.NUMBER, description: "Impacto financeiro/econômico (0-10): retorno financeiro, rentabilidade, economia de custos." },
            operational: { type: Type.NUMBER, description: "Eficiência operacional (0-10): produtividade, processos, recursos." },
            reputation: { type: Type.NUMBER, description: "Reputação/imagem (0-10): percepção de stakeholders, marca, confiança." },
            risk: { type: Type.NUMBER, description: "Gestão de risco (0-10): controle de riscos, segurança, previsibilidade. Quanto maior, menor o risco." },
            innovation: { type: Type.NUMBER, description: "Inovação (0-10): capacidade de inovar, adaptação, competitividade futura." },
            sustainability: { type: Type.NUMBER, description: "Sustentabilidade de longo prazo (0-10): viabilidade a longo prazo, responsabilidade, legado." }
          },
          required: ['financial', 'operational', 'reputation', 'risk', 'innovation', 'sustainability']
        }
      },
      required: ['real', 'inverted']
    }
  },
  required: ['realDecision', 'invertedDecision', 'impacts', 'strategicNarrative', 'radarMetrics']
};


export const runSimulation = async (decisionText: string): Promise<SimulationResult> => {
  const tryGenerate = async (): Promise<string> => {
    for (const model of modelsOrder) {
      let attempt = 0;
      while (attempt < 3) {
        try {
          const response = await ai.models.generateContent({
            model,
            contents: `Você é um consultor de estratégia de negócios sênior. Analise a seguinte decisão empresarial, formule sua versão invertida e gere uma análise comparativa completa. A decisão é: "${decisionText}"`,
            config: {
              responseMimeType: 'application/json',
              responseSchema: schema,
              temperature: 0.5,
            }
          });
          const txt = response.text.trim();
          if (!txt) throw new Error('Resposta vazia');
          return txt;
        } catch (err: any) {
          const msg = typeof err?.message === 'string' ? err.message : '';
          const code = err?.error?.code;
          const overloaded = msg.toLowerCase().includes('overloaded') || code === 503 || msg.includes('UNAVAILABLE');
          if (overloaded) {
            await sleep(500 * Math.pow(2, attempt));
            attempt += 1;
            if (attempt >= 3) break;
            continue;
          }
          if (msg.includes('API key')) throw new Error('Chave de API inválida ou não configurada. Verifique o arquivo .env.local');
          if (msg.includes('quota')) throw new Error('Limite de quota da API atingido. Tente novamente mais tarde.');
          if (msg.includes('rate limit')) throw new Error('Muitas requisições. Aguarde alguns segundos e tente novamente.');
          if (msg.includes('network') || msg.includes('fetch')) throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
          if (msg.includes('JSON')) throw new Error('Erro ao processar a resposta da API. Tente novamente.');
          throw new Error(`Erro na simulação: ${msg || 'desconhecido'}`);
        }
      }
    }
    throw new Error('Modelo sobrecarregado. Tente novamente em alguns segundos.');
  };

  const resultText = await tryGenerate();
  const resultJson = JSON.parse(resultText);
  return resultJson as SimulationResult;
};
