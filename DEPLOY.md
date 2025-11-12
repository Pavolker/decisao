# Guia de Deploy no Netlify

Este documento contém instruções para fazer deploy do **Simulador de Decisões Invertidas** no Netlify.

## Pré-requisitos

1. Conta no [Netlify](https://www.netlify.com/) (gratuita)
2. Repositório Git (GitHub, GitLab ou Bitbucket) - opcional, mas recomendado
3. Chave API do Google Gemini configurada

## Opção 1: Deploy via Git (Recomendado)

### Passo 1: Preparar o repositório

1. Inicialize um repositório Git (se ainda não tiver):
```bash
git init
git add .
git commit -m "Initial commit"
```

2. Envie para o GitHub/GitLab:
```bash
git remote add origin <URL_DO_SEU_REPOSITORIO>
git push -u origin main
```

### Passo 2: Conectar ao Netlify

1. Acesse [Netlify](https://app.netlify.com/)
2. Clique em **"Add new site"** > **"Import an existing project"**
3. Escolha seu provedor Git (GitHub, GitLab, Bitbucket)
4. Selecione o repositório do projeto
5. Configure as opções de build:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Branch to deploy:** `main`

### Passo 3: Configurar variáveis de ambiente

1. No painel do Netlify, vá em **Site settings** > **Environment variables**
2. Adicione a variável:
   - **Key:** `VITE_GEMINI_API_KEY`
   - **Value:** Sua chave API do Google Gemini

### Passo 4: Deploy

1. Clique em **"Deploy site"**
2. Aguarde o build ser concluído
3. Seu site estará disponível em `https://<seu-site>.netlify.app`

## Opção 2: Deploy Manual (Drag and Drop)

### Passo 1: Build local

1. Execute o build localmente:
```bash
npm run build
```

2. A pasta `dist` será criada com os arquivos de produção

### Passo 2: Configurar variável de ambiente

⚠️ **IMPORTANTE:** Para deploy manual, você precisa configurar a API key ANTES do build:

1. Edite o arquivo `.env.local` com sua chave real
2. Execute novamente:
```bash
npm run build
```

### Passo 3: Deploy no Netlify

1. Acesse [Netlify](https://app.netlify.com/)
2. Clique em **"Add new site"** > **"Deploy manually"**
3. Arraste e solte a pasta `dist` na área indicada
4. Aguarde o upload concluir
5. Seu site estará disponível em `https://<seu-site>.netlify.app`

## Opção 3: Deploy via CLI do Netlify

### Passo 1: Instalar Netlify CLI

```bash
npm install -g netlify-cli
```

### Passo 2: Login

```bash
netlify login
```

### Passo 3: Deploy

```bash
# Deploy de teste
netlify deploy

# Deploy de produção
netlify deploy --prod
```

## Configurações Importantes

### Domínio Customizado

1. No painel do Netlify, vá em **Domain settings**
2. Clique em **"Add custom domain"**
3. Siga as instruções para configurar seu domínio

### HTTPS

O Netlify fornece HTTPS automático e gratuito via Let's Encrypt.

### Variáveis de Ambiente de Produção

**IMPORTANTE:** NUNCA commite o arquivo `.env.local` com sua chave API real no Git!

Para produção, sempre use as variáveis de ambiente do Netlify:
- Site settings > Environment variables

## Atualizações Futuras

Para atualizar o site após mudanças:

### Com Git:
```bash
git add .
git commit -m "Sua mensagem de commit"
git push
```
O Netlify fará deploy automático.

### Deploy Manual:
Execute `npm run build` novamente e faça upload da pasta `dist` atualizada.

## Monitoramento

- **Deploy logs:** Disponíveis no painel do Netlify em "Deploys"
- **Analytics:** Disponível em "Analytics" (plano pago)
- **Functions logs:** Se usar Netlify Functions

## Troubleshooting

### Build falhou
- Verifique os logs no painel do Netlify
- Certifique-se de que `VITE_GEMINI_API_KEY` está configurada
- Verifique se todas as dependências estão no `package.json`

### Site não carrega corretamente
- Verifique se o arquivo `netlify.toml` está presente
- Verifique se o arquivo `public/_redirects` está presente
- Limpe o cache do navegador

### API não funciona
- Verifique se a variável `VITE_GEMINI_API_KEY` está configurada corretamente
- Verifique se a chave API é válida no Google AI Studio
- Verifique as cotas da API no Google Cloud Console

## Segurança

⚠️ **Importante sobre a chave API:**

Este projeto expõe a chave API do Gemini no frontend. Para produção, considere:

1. Implementar um backend/proxy para proteger a chave
2. Usar restrições de domínio na API key do Google Cloud
3. Implementar rate limiting
4. Adicionar autenticação de usuários

## Recursos Adicionais

- [Documentação do Netlify](https://docs.netlify.com/)
- [Netlify CLI](https://docs.netlify.com/cli/get-started/)
- [Vite Deploy Guide](https://vitejs.dev/guide/static-deploy.html)

---

**Desenvolvido por PVolker - 2025**
