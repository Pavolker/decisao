
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
  throw new Error("VITE_GEMINI_API_KEY environment variable is not set. Please add it to your .env.local file.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

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
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Você é um consultor de estratégia de negócios sênior. Analise a seguinte decisão empresarial, formule sua versão invertida e gere uma análise comparativa completa. A decisão é: "${decisionText}"`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: schema,
        temperature: 0.5,
      }
    });

    const resultText = response.text.trim();

    if (!resultText) {
      throw new Error("A API retornou uma resposta vazia.");
    }

    const resultJson = JSON.parse(resultText);

    return resultJson as SimulationResult;
  } catch (error) {
    console.error("Error running simulation:", error);

    // Tratamento de erros específicos
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throw new Error("Chave de API inválida ou não configurada. Verifique o arquivo .env.local");
      }
      if (error.message.includes('quota')) {
        throw new Error("Limite de quota da API atingido. Tente novamente mais tarde.");
      }
      if (error.message.includes('rate limit')) {
        throw new Error("Muitas requisições. Aguarde alguns segundos e tente novamente.");
      }
      if (error.message.includes('network') || error.message.includes('fetch')) {
        throw new Error("Erro de conexão. Verifique sua internet e tente novamente.");
      }
      if (error.message.includes('JSON')) {
        throw new Error("Erro ao processar a resposta da API. Tente novamente.");
      }

      // Se for um erro conhecido mas sem tratamento específico
      throw new Error(`Erro na simulação: ${error.message}`);
    }

    throw new Error("Erro desconhecido ao gerar a simulação. Verifique o console para mais detalhes.");
  }
};
