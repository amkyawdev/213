<template>
  <div class="docs-container min-h-screen p-6">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <header class="mb-12 text-center">
        <div class="w-16 h-16 rounded-2xl bg-gradient-gold flex items-center justify-center mx-auto mb-6">
          <i class="bi bi-book text-burme-black text-2xl"></i>
        </div>
        <h1 class="heading-font text-4xl font-bold golden-text mb-4">Documentation</h1>
        <p class="text-burme-light/60">Everything you need to know about Burme AI</p>
      </header>

      <!-- Search -->
      <div class="mb-8">
        <div class="relative">
          <i class="bi bi-search absolute left-4 top-1/2 -translate-y-1/2 text-burme-light/40"></i>
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search documentation..."
            class="w-full bg-burme-gray/50 border border-burme-gold/20 rounded-xl pl-12 pr-4 py-3 focus:border-burme-gold/50 focus:ring-2 focus:ring-burme-gold/20"
          />
        </div>
      </div>

      <!-- Table of Contents -->
      <nav class="mb-8">
        <div class="glass-light rounded-2xl p-6 gold-border">
          <h3 class="font-semibold mb-4 text-burme-gold">Quick Navigation</h3>
          <ul class="space-y-2">
            <li v-for="section in tableOfContents" :key="section.id">
              <a 
                :href="'#' + section.id"
                class="flex items-center gap-2 text-burme-light/70 hover:text-burme-gold transition-colors"
                @click.prevent="scrollTo(section.id)"
              >
                <i :class="section.icon"></i>
                {{ section.title }}
              </a>
            </li>
          </ul>
        </div>
      </nav>

      <!-- FAQ Section -->
      <section id="getting-started" class="mb-12">
        <h2 class="heading-font text-2xl font-bold mb-6 flex items-center gap-3">
          <span class="w-8 h-8 rounded-lg bg-gradient-gold flex items-center justify-center">
            <i class="bi bi-rocket text-burme-black"></i>
          </span>
          Getting Started
        </h2>
        
        <div class="space-y-4">
          <div 
            v-for="(faq, index) in faqs.gettingStarted" 
            :key="index"
            class="faq-item glass-light rounded-xl overflow-hidden gold-border"
          >
            <button 
              @click="toggleFaq(index)"
              class="w-full flex items-center justify-between p-5 text-left hover:bg-burme-gray/20 transition-colors"
            >
              <span class="font-medium pr-4">{{ faq.question }}</span>
              <i :class="openFaqs.includes(index) ? 'bi bi-chevron-up' : 'bi bi-chevron-down'" class="text-burme-gold"></i>
            </button>
            <div 
              v-show="openFaqs.includes(index)"
              class="px-5 pb-5 text-burme-light/70 markdown-content"
              v-html="faq.answer"
            ></div>
          </div>
        </div>
      </section>

      <!-- Architecture Section -->
      <section id="architecture" class="mb-12">
        <h2 class="heading-font text-2xl font-bold mb-6 flex items-center gap-3">
          <span class="w-8 h-8 rounded-lg bg-gradient-gold flex items-center justify-center">
            <i class="bi bi-diagram-3 text-burme-black"></i>
          </span>
          System Architecture
        </h2>
        
        <div class="glass-light rounded-2xl p-6 gold-border">
          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <h4 class="font-semibold text-burme-gold mb-3">Frontend Stack</h4>
              <ul class="space-y-2 text-burme-light/70">
                <li class="flex items-center gap-2">
                  <i class="bi bi-check-circle text-green-500"></i>
                  Vue.js 3 with Composition API
                </li>
                <li class="flex items-center gap-2">
                  <i class="bi bi-check-circle text-green-500"></i>
                  Vite for lightning-fast builds
                </li>
                <li class="flex items-center gap-2">
                  <i class="bi bi-check-circle text-green-500"></i>
                  Tailwind CSS for styling
                </li>
                <li class="flex items-center gap-2">
                  <i class="bi bi-check-circle text-green-500"></i>
                  Three.js for micro-interactions
                </li>
              </ul>
            </div>
            <div>
              <h4 class="font-semibold text-burme-gold mb-3">Backend Stack</h4>
              <ul class="space-y-2 text-burme-light/70">
                <li class="flex items-center gap-2">
                  <i class="bi bi-check-circle text-green-500"></i>
                  FastAPI with async support
                </li>
                <li class="flex items-center gap-2">
                  <i class="bi bi-check-circle text-green-500"></i>
                  JWT authentication
                </li>
                <li class="flex items-center gap-2">
                  <i class="bi bi-check-circle text-green-500"></i>
                  Smart Provider Router
                </li>
                <li class="flex items-center gap-2">
                  <i class="bi bi-check-circle text-green-500"></i>
                  Streaming response support
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- API Reference -->
      <section id="api" class="mb-12">
        <h2 class="heading-font text-2xl font-bold mb-6 flex items-center gap-3">
          <span class="w-8 h-8 rounded-lg bg-gradient-gold flex items-center justify-center">
            <i class="bi bi-code text-burme-black"></i>
          </span>
          API Reference
        </h2>
        
        <div class="space-y-4">
          <div class="glass-light rounded-xl p-6 gold-border">
            <div class="flex items-center gap-3 mb-4">
              <span class="px-2 py-1 rounded bg-green-500/20 text-green-500 text-sm font-mono">POST</span>
              <code class="text-burme-gold">/api/chat/stream</code>
            </div>
            <p class="text-burme-light/70 mb-4">Streaming chat endpoint for AI interactions</p>
            <div class="bg-burme-black rounded-lg p-4 overflow-x-auto">
              <pre class="text-sm text-burme-light/80"><code>// Request
{
  "message": "Hello, how are you?",
  "session_id": "optional-session-id"
}

// Response (Server-Sent Events)
data: {"content": "Hello", "provider": "cerebras"}
data: {"content": "!", "provider": "cerebras"}</code></pre>
            </div>
          </div>

          <div class="glass-light rounded-xl p-6 gold-border">
            <div class="flex items-center gap-3 mb-4">
              <span class="px-2 py-1 rounded bg-blue-500/20 text-blue-500 text-sm font-mono">GET</span>
              <code class="text-burme-gold">/api/health</code>
            </div>
            <p class="text-burme-light/70 mb-4">Health check endpoint</p>
            <div class="bg-burme-black rounded-lg p-4 overflow-x-auto">
              <pre class="text-sm text-burme-light/80"><code>{
  "status": "healthy",
  "app_state": "running",
  "available_providers": ["cerebras", "groq", "openrouter"]
}</code></pre>
            </div>
          </div>
        </div>
      </section>

      <!-- Smart Provider Router -->
      <section id="providers" class="mb-12">
        <h2 class="heading-font text-2xl font-bold mb-6 flex items-center gap-3">
          <span class="w-8 h-8 rounded-lg bg-gradient-gold flex items-center justify-center">
            <i class="bi bi-shuffle text-burme-black"></i>
          </span>
          Smart Provider Router
        </h2>
        
        <div class="glass-light rounded-2xl p-6 gold-border">
          <p class="text-burme-light/70 mb-6">
            Burme AI uses a sophisticated provider routing system to ensure maximum uptime and optimal performance.
          </p>
          
          <div class="relative">
            <div class="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-burme-gold via-burme-champagne to-burme-gold"></div>
            
            <div class="space-y-6">
              <div v-for="(provider, index) in providers" :key="provider.name" class="relative pl-12">
                <div class="absolute left-3 w-6 h-6 rounded-full bg-gradient-gold flex items-center justify-center">
                  <span class="text-burme-black text-xs font-bold">{{ index + 1 }}</span>
                </div>
                <div class="glass rounded-xl p-4 gold-border">
                  <h4 class="font-semibold text-burme-gold">{{ provider.name }}</h4>
                  <p class="text-sm text-burme-light/60 mt-1">{{ provider.description }}</p>
                  <div class="mt-2 text-xs text-burme-light/50">
                    <span class="mr-4"><strong>Model:</strong> {{ provider.model }}</span>
                    <span><strong>Priority:</strong> {{ provider.priority }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Security -->
      <section id="security" class="mb-12">
        <h2 class="heading-font text-2xl font-bold mb-6 flex items-center gap-3">
          <span class="w-8 h-8 rounded-lg bg-gradient-gold flex items-center justify-center">
            <i class="bi bi-shield-check text-burme-black"></i>
          </span>
          Security
        </h2>
        
        <div class="grid md:grid-cols-2 gap-6">
          <div class="glass-light rounded-xl p-6 gold-border">
            <h4 class="font-semibold text-burme-gold mb-3">Authentication</h4>
            <ul class="space-y-2 text-burme-light/70">
              <li>• JWT-based token authentication</li>
              <li>• 24-hour token expiration</li>
              <li>• Secure password hashing (bcrypt)</li>
            </ul>
          </div>
          <div class="glass-light rounded-xl p-6 gold-border">
            <h4 class="font-semibold text-burme-gold mb-3">Data Protection</h4>
            <ul class="space-y-2 text-burme-light/70">
              <li>• Encrypted storage for user data</li>
              <li>• Binary format for chat history</li>
              <li>• API key protection</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="pt-8 border-t border-t-burme-gold/10 text-center">
        <p class="text-burme-light/50">
          Still have questions? <a href="/about" class="text-burme-gold hover:underline">Contact us</a>
        </p>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const searchQuery = ref('')
const openFaqs = ref([])

const tableOfContents = [
  { id: 'getting-started', title: 'Getting Started', icon: 'bi bi-rocket' },
  { id: 'architecture', title: 'System Architecture', icon: 'bi bi-diagram-3' },
  { id: 'api', title: 'API Reference', icon: 'bi bi-code' },
  { id: 'providers', title: 'Smart Provider Router', icon: 'bi bi-shuffle' },
  { id: 'security', title: 'Security', icon: 'bi bi-shield-check' }
]

const faqs = {
  gettingStarted: [
    {
      question: 'How do I get started with Burme AI?',
      answer: '<p>Getting started is easy! Simply <a href="/register" class="text-burme-gold hover:underline">create an account</a>, log in, and start chatting. No additional setup required.</p>'
    },
    {
      question: 'What AI models does Burme AI use?',
      answer: '<p>Burme AI primarily uses <strong>Llama 3.1 70B</strong> and <strong>Llama 3.1 8B</strong> models through our partner providers including Cerebras, Groq, OpenRouter, and NVIDIA for maximum speed and reliability.</p>'
    },
    {
      question: 'Is there a rate limit?',
      answer: '<p>Burme AI uses a smart provider failover system. If one provider hits rate limits, we automatically switch to the next available provider in under 500ms, ensuring uninterrupted service.</p>'
    },
    {
      question: 'How does the smart failover work?',
      answer: '<p>Our system monitors each API request. If a provider returns a 429 (rate limit) or 500 error, we instantly route your request to the next available provider while maintaining your chat stream continuity.</p>'
    }
  ]
}

const providers = [
  { name: 'Cerebras', description: 'Primary provider with ultra-fast inference speeds', model: 'llama-3.3-70b', priority: 1 },
  { name: 'Groq', description: 'High-speed inference accelerator', model: 'llama-3.1-70b-versatile', priority: 2 },
  { name: 'OpenRouter', description: 'Aggregated access to multiple models', model: 'meta-llama/llama-3.1-70b-instruct', priority: 3 },
  { name: 'NVIDIA', description: 'GPU-accelerated inference', model: 'meta/llama-3.1-70b-instruct', priority: 4 }
]

function toggleFaq(index) {
  if (openFaqs.value.includes(index)) {
    openFaqs.value = openFaqs.value.filter(i => i !== index)
  } else {
    openFaqs.value.push(index)
  }
}

function scrollTo(sectionId) {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<style scoped>
.docs-container {
  background: linear-gradient(180deg, #0A0A0A 0%, #111111 100%);
  min-height: 100vh;
}

.faq-item {
  animation: slideUp 0.3s ease forwards;
}

@keyframes slideUp {
  to { opacity: 1; transform: translateY(0); }
  from { opacity: 0; transform: translateY(10px); }
}
</style>