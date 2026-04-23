# 🤖 Burme AI

> **Premium AI Web Application** — Lightning-fast AI chat powered by Cerebras with a luxurious black & gold design.

<p align="center">
  <img src="frontend/public/favicon.svg" alt="Burme AI" width="120" height="120">
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-api-documentation">API Docs</a> •
  <a href="#-deployment">Deployment</a>
</p>

---

## ✨ Features

### 🚀 High-Performance AI
- **Cerebras Integration** — Ultra-fast Llama 3.3 70B inference
- **Streaming Responses** — Real-time AI chat with SSE
- **Sub-200ms Latency** — Optimized for speed

### 🎨 Premium UI/UX
- **Black & Gold Design** — Luxurious matte black with metallic gold accents
- **Three.js Interactions** — 3D tilt effects, golden particle bursts
- **Glassmorphism** — Elegant glass effects navigation
- **Markdown + LaTeX** — Beautiful code, markdown, and math rendering

### 📱 Responsive Design
- **Desktop Sidenav** — Collapsible glassmorphism sidebar
- **Mobile Bottom Dock** — Social media-style animated navigation
- **PWA Ready** — Installable as progressive web app

### 🔐 Security
- **JWT Authentication** — Secure token-based auth
- **Bcrypt Hashing** — Industry-standard password security
- **API Key Protection** — Environment variable management

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| [Vue.js 3](https://vuejs.org/) | UI Framework (Composition API) |
| [Vite](https://vitejs.dev/) | Build Tool |
| [Tailwind CSS](https://tailwindcss.com/) | Styling |
| [Three.js](https://threejs.org/) | Micro-interactions |
| [KaTeX](https://katex.org/) | LaTeX Math Rendering |
| [Marked](https://marked.js.org/) | Markdown Parsing |

### Backend
| Technology | Purpose |
|------------|---------|
| [FastAPI](https://fastapi.tiangolo.com/) | Python Web Framework |
| [JWT](https://python-jose.readthedocs.io/) | Authentication |
| [Passlib](https://passlib.readthedocs.io/) | Password Hashing |
| [httpx](https://www.python-httpx.org/) | Async HTTP Client |

### AI Provider
| Provider | Model | Status |
|----------|-------|--------|
| [Cerebras](https://cerebras.ai/) | Llama 3.3 70B | Primary |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Python 3.9+
- Cerebras API Key

### Installation

```bash
# Clone the repository
git clone https://github.com/amkyawdev/213.git
cd 213

# Install frontend dependencies
cd frontend && npm install

# Install backend dependencies
cd ../backend && pip install -r requirements.txt
```

### Configuration

Create a `.env` file in the backend directory:

```env
# Cerebras API
CEREBRAS_API_KEY=your_cerebras_api_key_here

# JWT Secret (generate a strong random string)
JWT_SECRET=your_super_secret_jwt_key_here
```

### Running Locally

```bash
# Terminal 1 - Frontend
cd frontend
npm run dev

# Terminal 2 - Backend
cd backend
python main.py
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📖 API Documentation

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "johndoe",
  "password": "securepassword123"
}
```

### Chat

#### Stream Chat (SSE)
```http
POST /api/chat/stream
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "Explain quantum computing in simple terms"
}
```

**Response:** Server-Sent Events stream

```
data: {"content": "Sure", "provider": "cerebras"}
data: {"content": "!", "provider": "cerebras"}
data: {"content": " Quantum", "provider": "cerebras"}
...
```

### Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "status": "healthy",
  "app_state": "running",
  "available_providers": ["cerebras"]
}
```

---

## 🗂 Project Structure

```
burme-ai/
├── frontend/                 # Vue.js 3 Frontend
│   ├── public/
│   │   ├── favicon.svg      # PWA Icon
│   │   └── manifest.json    # PWA Manifest
│   ├── src/
│   │   ├── components/       # Vue Components
│   │   │   ├── DesktopNav.vue
│   │   │   ├── MobileDock.vue
│   │   │   └── PremiumButton.vue
│   │   ├── views/           # Page Views
│   │   │   ├── HomeView.vue
│   │   │   ├── ChatView.vue
│   │   │   ├── DashboardView.vue
│   │   │   ├── DocsView.vue
│   │   │   └── AboutView.vue
│   │   ├── stores/          # Pinia Stores
│   │   │   ├── auth.js
│   │   │   └── chat.js
│   │   ├── composables/     # Vue Composables
│   │   │   └── useParticleSystem.js
│   │   └── router/          # Vue Router
│   ├── tailwind.config.js   # Tailwind Configuration
│   └── vite.config.js       # Vite Configuration
├── backend/                 # FastAPI Backend
│   ├── main.py             # Main Application
│   └── requirements.txt    # Python Dependencies
├── data/                    # Data Storage
│   ├── user-list.json      # User Database
│   ├── database.json       # App State & Logs
│   └── chat-history.bin    # Chat History (Binary)
├── vercel.json             # Vercel Configuration
└── package.json            # Root Package.json
```

---

## 🚢 Deployment

### Vercel (Recommended)

1. **Connect Repository**
   ```bash
   vercel login
   vercel link
   ```

2. **Set Environment Variables**
   ```bash
   vercel env add CEREBRAS_API_KEY
   vercel env add JWT_SECRET
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Manual Build

```bash
# Build frontend
npm run build

# Preview production build
npm run preview
```

---

## 🎨 Design System

### Colors

| Name | Hex | Usage |
|------|-----|-------|
| **Burme Black** | `#0A0A0A` | Primary background |
| **Burme Dark** | `#000000` | Deep background |
| **Burme Gold** | `#D4AF37` | Primary accent |
| **Champagne** | `#F1D592` | Secondary accent |
| **Burme Gray** | `#1A1A1A` | Cards, surfaces |
| **Burme Light** | `#E5E5E5` | Primary text |

### Typography

- **Headings:** Playfair Display (serif)
- **Body:** Inter (sans-serif)
- **Code:** Fira Code (monospace)

### Components

- `PremiumButton` — 3D tilt, glow effects, golden particle burst on click
- `DesktopNav` — Glassmorphism collapsible sidebar
- `MobileDock` — Bottom navigation for mobile

---

## 📜 License

MIT License — See [LICENSE](LICENSE) for details.

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

<p align="center">
  <strong>Built with ❤️ using Vue.js + FastAPI</strong>
</p>

<p align="center">
  <a href="https://github.com/amkyawdev/213">GitHub</a> •
  <a href="https://vercel.com">Vercel</a>
</p>