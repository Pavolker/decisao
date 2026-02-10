# Como Configurar a Variável de Ambiente no Netlify

## Problema
Erro: `GROQ_API_KEY environment variable is not set`

## Solução

### Via Interface Web (RECOMENDADO)

1. Acesse: https://app.netlify.com/
2. Selecione seu site
3. Vá em: **Site configuration** > **Environment variables**
4. Clique em: **"Add a variable"**
5. Configure:
   - **Key:** `GROQ_API_KEY`
   - **Value:** sua chave da Groq
   - **Scopes:** Marque todos (Production, Deploy Previews, Branch deploys)
6. (Opcional) Adicione:
   - **Key:** `GROQ_MODEL`
   - **Value:** `llama-3.1-8b-instant`
7. Vá para **Deploys** > **Trigger deploy** > **Deploy site**
8. Aguarde o build completar

### Via CLI do Netlify (Alternativa)

```bash
# Instalar Netlify CLI (se ainda não tiver)
npm install -g netlify-cli

# Fazer login
netlify login

# Ir para o diretório do projeto
cd "/Users/pvolkermini/Library/Mobile Documents/com~apple~CloudDocs/APP DEV/APP CRITICOS/DECISAO INVERTIDA"

# Configurar a variável de ambiente
netlify env:set GROQ_API_KEY gsk-sua-chave-aqui

# (Opcional) Modelo
netlify env:set GROQ_MODEL llama-3.1-8b-instant

# Fazer redeploy
netlify deploy --prod
```

## Verificar se funcionou

1. Acesse seu site
2. Abra o Console do navegador (F12)
3. O erro NÃO deve mais aparecer
4. Teste fazendo uma simulação

## Troubleshooting

### Se ainda der erro:
1. Verifique se a variável foi criada corretamente em **Site configuration** > **Environment variables**
2. Certifique-se de que o nome está EXATAMENTE como: `GROQ_API_KEY` (case-sensitive)
3. Faça um novo deploy manual: **Deploys** > **Trigger deploy** > **Clear cache and deploy site**
4. Aguarde pelo menos 2-3 minutos após o deploy completar

### Se a API Key não funcionar:
1. Verifique se a chave é válida no painel da Groq
2. Se necessário, gere uma nova chave
3. Atualize a variável no Netlify
4. Faça novo deploy

## Links Úteis

- Painel do Netlify: https://app.netlify.com/
- Documentação Netlify: https://docs.netlify.com/environment-variables/overview/

---

**IMPORTANTE:** Nunca compartilhe sua chave API publicamente ou faça commit dela no Git!
