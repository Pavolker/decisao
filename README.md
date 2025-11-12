<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/temp/1

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure your API key:
   - Open [.env.local](.env.local)
   - Replace `PLACEHOLDER_API_KEY` with your actual Gemini API key:
   ```
   VITE_GEMINI_API_KEY=your_actual_api_key_here
   ```
   - Get your API key at: https://aistudio.google.com/app/apikey

3. Run the app:
   ```bash
   npm run dev
   ```

## ⚠️ Security Warning

**This app exposes the Gemini API key in the browser (client-side).**

This is acceptable for:
- Local development
- Personal demos
- Testing purposes

**NOT recommended for production** without implementing:
1. Backend proxy server to protect the API key
2. User authentication and rate limiting
3. Domain restrictions on your Google Cloud API key settings

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
