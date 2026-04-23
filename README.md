# Burme AI - Premium AI Web Application

<p align="center">
  <img src="frontend/public/favicon.svg" alt="Burme AI Logo" width="100" height="100">
</p>

<p align="center">
  <strong>Premium Intelligence, Unmatched Speed</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#deployment">Deployment</a> •
  <a href="#api-documentation">API Docs</a>
</p>

---

## Features

### 🚀 High-Performance AI
- **Smart Provider Router**: Automatic failover between Cerebras, Groq, OpenRouter, and NVIDIA
- **Streaming Responses**: Real-time AI responses with seamless provider switching
- **Sub-200ms Latency**: Powered by Cerebras for lightning-fast inference

### 🎨 Premium UI/UX
- **Black & Gold Design**: Luxurious matte black with metallic gold accents
- **Three.js Micro-Interactions**: 3D tilt effects, golden particle bursts on click
- **Glassmorphism Navigation**: Elegant glass effects on desktop and mobile docks
- **Markdown + LaTeX Support**: Beautiful rendering of code, markdown, and math

### 🔐 Security & Auth
- **JWT Authentication**: Secure token-based authentication
- **Bcrypt Password Hashing**: Industry-standard password security
- **JSON + Binary Storage**: Efficient user and chat history storage

### 📱 Responsive Design
- **Desktop Sidenav**: Collapsible glassmorphism sidebar
- **Mobile Bottom Dock**: Social media-style animated navigation
- **PWA Ready**: Installable as a progressive web app

---

## Tech Stack

### Frontend
- **Vue.js 3** (Composition API)
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Bootstrap 5** - Icons and utility components
- **Three.js** - Micro-interactions and particle effects
- **KaTeX** - LaTeX math rendering
- **Marked** - Markdown parsing

### Backend
- **FastAPI** - Modern Python web framework
- **JWT** - JSON Web Tokens for auth
- **Passlib** - Password hashing
- **httpx** - Async HTTP client for AI providers

### AI Providers
1. **Cerebras** (Primary) - Ultra-fast Llama 3.3 70B
2. **Groq** - High-speed inference
3. **OpenRouter** - Multi-model access
4. **NVIDIA** - GPU-accelerated inference

---

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.9+
- API keys for at least one AI provider

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/burme-ai.git
cd burme-ai
```

2. **Install frontend dependencies**
```bash
cd frontend
npm install
```

3. **Install backend dependencies**
```bash
cd ../backend
pip install -r requirements.txt
```

4. **Configure environment**
```bash
cp ../env.txt .env
# Edit .env with your API keys
```

5. **Start development servers**
```bash
# Terminal 1 - Frontend
cd frontend
npm run dev

# Terminal 2 - Backend
cd backend
python main.py
```

6. **Open in browser**
```
http://localhost:3000
```

---

## Deployment

### Vercel Deployment

1. **Connect to Vercel**
```bash
npm i -g vercel
vercel login
vercel link
```

2. **Set environment variables**
```bash
vercel env add CEREBRAS_API_KEY
vercel env add GROQ_API_KEY
# ... add other API keys
```

3. **Deploy**
```bash
vercel --prod
```

### Local Production Build

```bash
npm run build
npm run preview
```

---

## API Documentation

### Authentication

#### Register
```
POST /api/auth/register
Body: { "username": "string", "email": "string", "password": "string" }
Response: { "access_token": "string", "token_type": "bearer" }
```

#### Login
```
POST /api/auth/login
Body: { "username": "string", "password": "string" }
Response: { "access_token": "string", "token_type": "bearer" }
```

### Chat

#### Stream Chat (Server-Sent Events)
```
POST /api/chat/stream
Headers: Authorization: Bearer <token>
Body: { "message": "string", "session_id": "string?" }
Response: Server-Sent Events stream
```

### Dashboard

#### Get Stats
```
GET /api/dashboard/stats
Headers: Authorization: Bearer <token>
Response: { total_users, active_users, total_requests, ... }
```

---

## Project Structure

```
burme-ai/
├── api/                    # Vercel serverless functions
│   └── index.py           # API handler
├── backend/               # FastAPI backend
│   ├── main.py           # Main application
│   └── requirements.txt  # Python dependencies
├── data/                  # Data storage
│   ├── user-list.json    # User database
│   ├── database.json     # App state & logs
│   └── chat-history.bin  # Chat history (binary)
├── frontend/             # Vue.js frontend
│   ├── public/           # Static assets
│   │   └── favicon.svg   # PWA icon
│   ├── src/              # Source code
│   │   ├── components/   # Vue components
│   │   ├── views/        # Page views
│   │   ├── stores/       # Pinia stores
│   │   ├── composables/  # Vue composables
│   │   └── router/       # Vue Router
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
├── env.txt               # Environment template
├── package.json          # Root package.json
├── vercel.json           # Vercel config
└── README.md
```

---

## Smart Provider Router

The Smart Provider Router ensures maximum uptime by automatically switching providers:

1. **Cerebras** (Primary) - Fastest inference
2. **Groq** (Fallback 1) - High-speed accelerator
3. **OpenRouter** (Fallback 2) - Multi-model access
4. **NVIDIA** (Fallback 3) - GPU-accelerated

### Failover Logic
- On **429 (Rate Limit)** or **500** error → Switch provider in <500ms
- Stream continuity maintained during switch
- No user disruption

---

## License

MIT License - See LICENSE file for details.

---

<p align="center">
  <strong>Built with ❤️ by Burme AI</strong>
</p>