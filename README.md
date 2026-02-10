<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Simulador de Decisões Invertidas (Groq LLaMA)

Aplicação web para simular os efeitos de uma decisão empresarial e sua versão invertida, usando Groq (LLaMA) via Netlify Functions.

## Rodar localmente

**Pré-requisito:** Node.js

1. Instale dependências:
   ```bash
   npm install
   ```

2. Configure as variáveis de ambiente:
   - Edite `.env.local`:
   ```
   GROQ_API_KEY=gsk-coloque_sua_chave_aqui
   GROQ_MODEL=llama-3.1-8b-instant
   ```

3. Rode usando Netlify Dev (para habilitar Functions):
   ```bash
   npx netlify dev
   ```

4. Abra a URL exibida no terminal.

## Segurança

A chave da Groq fica no **backend (Netlify Functions)**. Ela **não** é exposta no navegador.

---

## Features

### ✨ Core Functionality
- **Decision Simulation**: AI-powered analysis of business decisions and their opposites
- **Comparative Analysis**: Side-by-side comparison of real vs inverted decisions
- **Impact Assessment**: Economic, operational, and reputational impact evaluation
- **Strategic Narrative**: Comprehensive strategic analysis of both scenarios

### 📚 History & Templates
- **Simulation History**: Automatically saves your last 10 simulations in browser storage
- **Decision Templates**: Pre-configured decision examples across 6 business categories:
  - Strategy (International Expansion)
  - Human Resources (Remote Work)
  - Product (Premium Line)
  - Marketing (Digital Channels)
  - Finance (Cost Reduction)
  - Technology (Cloud Migration)
- **Quick Access**: Click any history item to reload it instantly

### 📤 Export & Sharing
- **Markdown Export**: Download simulation results as formatted markdown files
- **Professional Format**: Includes all analysis sections with proper formatting
- **Easy Sharing**: Share results with stakeholders via markdown files

### 🎨 User Experience
- **Character Counter**: Real-time validation with 500-character limit
- **Smart Validation**: Prevents empty or oversized submissions
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Loading States**: Clear visual feedback during AI processing
- **Error Handling**: Detailed error messages for different failure scenarios

---

## Usage Tips

1. **Start with Templates**: Click "Ver Templates de Decisões" to explore example decisions
2. **Check History**: Use the "Histórico" button to review past simulations
3. **Export Results**: Click "Exportar Markdown" to download analysis for sharing
4. **Clear Form**: Use "Limpar" button to start fresh
5. **Character Limit**: Keep decisions concise (max 500 characters) for best results
