# Lumina AI-Assisted Consulting Tool

## Overview

Lumina is an AI-powered consulting tool designed to assist in problem decomposition, analysis, and solution generation for complex consulting projects. It leverages advanced language models and interactive visualizations to provide insights and streamline the consulting process.

## Key Features

- Problem input and management
- AI-driven problem decomposition
- Interactive visualization of problem segments
- Assumption management with Monte Carlo analysis
- Literature review integration
- User authentication and profile management
- Modular AI model selection

## Architecture

Lumina uses a modern, scalable architecture:

- Frontend: Next.js with TypeScript
- Backend: Python with FastAPI
- AI Integration: LlamaIndex and OpenAI
- Database: PostgreSQL
- Authentication: Clerk
- Deployment: Vercel (frontend) and LlamaIndex-Deploy (backend)

## Getting Started

1. Clone the repository:
   ```
   git clone https://github.com/your-repo/lumina-ai-consulting.git
   cd lumina-ai-consulting
   ```

2. Install dependencies:
   ```
   npm install
   pip install -r requirements.txt
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local` and fill in the required values
   - Ensure you have valid API keys for OpenAI and Clerk

4. Run the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

### Frontend (Vercel)

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy using Vercel's automatic deployment

### Backend (LlamaIndex-Deploy)

1. Install LlamaIndex-Deploy:
   ```
   pip install llama-index-deploy
   ```

2. Configure your LlamaIndex-Deploy settings in `llama_index_deploy_config.yaml`

3. Deploy your backend:
   ```
   llama-index-deploy up
   ```

## Testing

Run the test suite:
npm run test

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.