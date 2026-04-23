# Burme AI - Premium AI Web Application Specification

## Project Overview
- **Project Name**: Burme AI
- **Type**: High-performance AI Web Application
- **Core Functionality**: Real-time AI chat with premium UI, multi-provider fallback, and admin analytics
- **Target Users**: Premium users seeking fast AI interactions, Admin dashboards for monitoring

## Tech Stack
- **Backend**: Python FastAPI (async + streaming)
- **Frontend**: Vue.js 3 (Composition API) + Vite
- **Styling**: Tailwind CSS + Bootstrap 5 CDN
- **AI Engine**: Cerebras API (primary), Groq/OpenRouter/NVIDIA (fallbacks)
- **Auth**: JWT-based authentication
- **Storage**: JSON files + Binary for chat history

## Design System

### Color Palette
- Primary: Deep Matte Black (#0A0A0A)
- Background: Black (#000000, #0A0A0A, #111111)
- Accent Primary: Metallic Gold (#D4AF37)
- Accent Secondary: Champagne Gold (#F1D592)
- Text Primary: White (#FFFFFF)
- Text Secondary: Gold tint (#E5E5E5)

### Typography
- Headings: Premium Sans-serif with golden text-shadow
- Body: Clean sans-serif (Inter/system fonts)
- Monospace: For code blocks

### Micro-Interactions (Three.js)
- 3D Tilt & Glow effect on buttons
- Golden particle burst on click
- Clean background (no Three.js on background)

## Routes & Pages

### `/` - Landing Page
- Premium branding video/animation
- Hero section with 3D animated elements
- Feature highlights
- CTA buttons

### `/chat` - Chat Interface
- Minimalist design
- Auto-expanding textarea
- Markdown + LaTeX support
- Streaming response display
- Message history sidebar

### `/dashboard` - Admin Analytics
- Real-time user activity
- API usage logs
- User management table
- Charts/visualizations

### `/docs` - Documentation
- Interactive FAQ
- System architecture details
- API documentation

### `/about` - About Page
- Company info
- Team section
- Contact information

## Smart Provider Router

### Provider Priority
1. **Primary**: Cerebras (Llama 3.1 70B/8B)
2. **Fallback 1**: Groq
3. **Fallback 2**: OpenRouter
4. **Fallback 3**: NVIDIA

### Failover Logic
- On 429 (Rate Limit) or 500 error: Switch provider < 500ms
- Seamless stream continuity
- No user disruption

## Navigation System

### Desktop (≥768px)
- Collapsible Elite Sidenav (glassmorphism blur)
- Hamburger menu toggle
- Hidden on mobile

### Mobile (<768px)
- Bottom Dock (social media style)
- Animated tab transitions
- Hidden on desktop

## Data Storage

### user-list.json
- Username, email, hashed password (passlib)
- Role (user/admin)
- Created timestamp

### database.json
- Global app state
- API status logs
- Metrics

### chat-history.bin
- Compressed JSON/binary format
- User chat sessions
- Long-term memory

## PWA Configuration
- Service Worker for offline support
- favicon.svg icon system
- Manifest.json

## Deployment
- Vercel-ready with package.json
- API routes via /api/*
- Static frontend build

## Security
- JWT authentication
- Password hashing (passlib/bcrypt)
- Input validation
- HTTPS enforcement