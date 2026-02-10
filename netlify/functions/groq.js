const MAX_BODY_BYTES = 1 * 1024 * 1024;
const DEFAULT_MODEL = 'llama-3.1-8b-instant';

const SYSTEM_PROMPT = `Você é um consultor de estratégia de negócios sênior.
Sua tarefa: analisar a decisão informada, formular sua versão invertida e gerar uma análise comparativa completa.

Responda SOMENTE com JSON válido, sem markdown, sem texto extra.
Siga exatamente este esquema e tipos:
{
  "realDecision": { "summary": "string" },
  "invertedDecision": { "summary": "string" },
  "impacts": {
    "economic": { "real": "string", "inverted": "string" },
    "operational": { "real": "string", "inverted": "string" },
    "reputational": { "real": "string", "inverted": "string" }
  },
  "strategicNarrative": "string",
  "radarMetrics": {
    "real": {
      "financial": number,
      "operational": number,
      "reputation": number,
      "risk": number,
      "innovation": number,
      "sustainability": number
    },
    "inverted": {
      "financial": number,
      "operational": number,
      "reputation": number,
      "risk": number,
      "innovation": number,
      "sustainability": number
    }
  }
}

Regras:
- summaries: 100-150 palavras
- strategicNarrative: 3 parágrafos, separados por \n\n
- radarMetrics: valores de 0 a 10 (números)
- Não invente chaves extras.
`;

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204 };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Metodo nao permitido.' })
    };
  }

  const apiKey = process.env.GROQ_API_KEY;
  const model = process.env.GROQ_MODEL || DEFAULT_MODEL;

  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'GROQ_API_KEY nao configurada.' })
    };
  }

  if (event.body && Buffer.byteLength(event.body, 'utf8') > MAX_BODY_BYTES) {
    return {
      statusCode: 413,
      body: JSON.stringify({ error: 'Payload muito grande.' })
    };
  }

  let payload = {};
  try {
    payload = JSON.parse(event.body || '{}');
  } catch (e) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'JSON invalido no corpo da requisicao.' })
    };
  }

  const message = payload.message;
  if (!message || typeof message !== 'string') {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Campo "message" obrigatorio.' })
    };
  }

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: `Decisão a analisar: "${message}"` }
  ];

  const groqPayload = {
    model,
    messages,
    temperature: 0.5
  };

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(groqPayload)
    });

    const responseText = await response.text();
    let data = {};
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      data = {};
    }

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: data.error?.message || 'Falha ao executar Groq API.' })
      };
    }

    const text = data.choices?.[0]?.message?.content;
    if (!text) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Groq não retornou resposta de texto.' })
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({ text })
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message || 'Erro ao contatar Groq.' })
    };
  }
};
