<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section class="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
      <!-- Background Gradient Orbs -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="orb orb-3"></div>
      </div>

      <div class="relative z-10 text-center max-w-4xl mx-auto">
        <!-- Logo Animation -->
        <div class="mb-8 animate-float">
          <div class="w-24 h-24 mx-auto rounded-2xl bg-gradient-gold flex items-center justify-center shadow-gold-glow-lg">
            <span class="text-burme-black font-bold text-5xl heading-font">B</span>
          </div>
        </div>

        <!-- Main Heading -->
        <h1 class="heading-font text-5xl md:text-7xl font-bold mb-6 golden-text golden-glow">
          Burme AI
        </h1>

        <p class="text-xl md:text-2xl text-burme-light/80 mb-4">
          Premium Intelligence, <span class="text-burme-champagne">Unmatched Speed</span>
        </p>

        <p class="text-burme-light/60 mb-12 max-w-2xl mx-auto">
          Experience the future of AI interaction with our lightning-fast infrastructure, 
          powered by state-of-the-art models and a smart multi-provider routing system.
        </p>

        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <PremiumButton 
            variant="primary" 
            size="lg" 
            icon="bi bi-rocket-takeoff"
            @click="$router.push('/chat')"
            class="particle-trigger"
          >
            Start Chatting
          </PremiumButton>

          <PremiumButton 
            variant="outline" 
            size="lg" 
            icon="bi bi-play-circle"
            @click="$router.push('/docs')"
          >
            Learn More
          </PremiumButton>
        </div>

        <!-- Stats Counter -->
        <div class="mt-20 grid grid-cols-3 gap-8 max-w-lg mx-auto">
          <div class="stat-item">
            <div class="text-3xl font-bold golden-text">70B</div>
            <div class="text-sm text-burme-light/60">Model Parameters</div>
          </div>
          <div class="stat-item">
            <div class="text-3xl font-bold golden-text">4</div>
            <div class="text-sm text-burme-light/60">AI Providers</div>
          </div>
          <div class="stat-item">
            <div class="text-3xl font-bold golden-text">99.9%</div>
            <div class="text-sm text-burme-light/60">Uptime</div>
          </div>
        </div>
      </div>

      <!-- Scroll Indicator -->
      <div class="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <i class="bi bi-chevron-double-down text-burme-gold text-2xl"></i>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 px-4">
      <div class="max-w-6xl mx-auto">
        <h2 class="heading-font text-4xl font-bold text-center mb-4 golden-text">
          Why Choose Burme AI?
        </h2>
        <p class="text-center text-burme-light/60 mb-16 max-w-2xl mx-auto">
          Built with cutting-edge technology to deliver the best AI experience possible.
        </p>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div 
            v-for="(feature, index) in features" 
            :key="index"
            class="feature-card glass-light rounded-2xl p-8 gold-border-hover transition-all duration-300"
          >
            <div class="w-14 h-14 rounded-xl bg-gradient-gold flex items-center justify-center mb-6">
              <i :class="feature.icon" class="text-2xl text-burme-black"></i>
            </div>
            <h3 class="text-xl font-semibold mb-3 text-burme-gold">{{ feature.title }}</h3>
            <p class="text-burme-light/70">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Tech Stack Section -->
    <section class="py-20 px-4 bg-burme-gray/30">
      <div class="max-w-6xl mx-auto">
        <h2 class="heading-font text-4xl font-bold text-center mb-4 golden-text">
          Elite Tech Stack
        </h2>
        <p class="text-center text-burme-light/60 mb-16">
          Powered by the best-in-class technologies.
        </p>

        <div class="flex flex-wrap justify-center gap-8">
          <div 
            v-for="tech in techStack" 
            :key="tech.name"
            class="tech-badge glass rounded-full px-6 py-3 flex items-center gap-3 gold-border-hover transition-all duration-300"
          >
            <i :class="tech.icon" class="text-burme-gold"></i>
            <span class="font-medium">{{ tech.name }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 px-4">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="heading-font text-4xl md:text-5xl font-bold mb-6 golden-text golden-glow">
          Ready to Experience AI Excellence?
        </h2>
        <p class="text-burme-light/70 mb-10 text-lg">
          Join thousands of users who trust Burme AI for their AI interactions.
        </p>
        <PremiumButton 
          variant="primary" 
          size="lg" 
          icon="bi bi-lightning-charge"
          @click="$router.push(authStore.isAuthenticated ? '/chat' : '/register')"
          class="particle-trigger"
        >
          {{ authStore.isAuthenticated ? 'Go to Chat' : 'Get Started Free' }}
        </PremiumButton>
      </div>
    </section>

    <!-- Footer -->
    <footer class="py-10 px-4 border-t border-t-burme-gold/10">
      <div class="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-gradient-gold flex items-center justify-center">
            <span class="text-burme-black font-bold text-sm">B</span>
          </div>
          <span class="golden-text heading-font font-bold">Burme AI</span>
        </div>
        <p class="text-burme-light/50 text-sm">
          © 2025 Burme AI. Premium AI Solutions.
        </p>
        <div class="flex gap-6">
          <a href="#" class="text-burme-light/50 hover:text-burme-gold transition-colors">
            <i class="bi bi-twitter-x text-xl"></i>
          </a>
          <a href="#" class="text-burme-light/50 hover:text-burme-gold transition-colors">
            <i class="bi bi-github text-xl"></i>
          </a>
          <a href="#" class="text-burme-light/50 hover:text-burme-gold transition-colors">
            <i class="bi bi-discord text-xl"></i>
          </a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import PremiumButton from '@/components/PremiumButton.vue'

const authStore = useAuthStore()

const features = [
  {
    icon: 'bi bi-lightning-charge',
    title: 'Lightning Fast',
    description: 'Powered by Cerebras with sub-second response times. Never wait for your AI.'
  },
  {
    icon: 'bi bi-shield-check',
    title: 'Smart Failover',
    description: 'Automatic provider switching in under 500ms. Always online, always available.'
  },
  {
    icon: 'bi bi-palette',
    title: 'Premium Design',
    description: 'Stunning black & gold aesthetic with Three.js micro-interactions.'
  },
  {
    icon: 'bi bi-markdown',
    title: 'Markdown + LaTeX',
    description: 'Full markdown support with syntax highlighting and LaTeX equations.'
  },
  {
    icon: 'bi bi-lock',
    title: 'Secure Auth',
    description: 'JWT-based authentication with bcrypt password hashing.'
  },
  {
    icon: 'bi bi-graph-up',
    title: 'Admin Dashboard',
    description: 'Real-time analytics and user management for administrators.'
  }
]

const techStack = [
  { name: 'FastAPI', icon: 'bi bi-lightning-fill' },
  { name: 'Vue.js 3', icon: 'bi bi-vuejs' },
  { name: 'Vite', icon: 'bi bi-rocket' },
  { name: 'Tailwind CSS', icon: 'bi bi-palette2' },
  { name: 'Three.js', icon: 'bi bi-box' },
  { name: 'Cerebras', icon: 'bi bi-cpu' }
]
</script>

<style scoped>
.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.3;
}

.orb-1 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, #D4AF37 0%, transparent 70%);
  top: 10%;
  left: 10%;
  animation: float 6s ease-in-out infinite;
}

.orb-2 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, #F1D592 0%, transparent 70%);
  bottom: 20%;
  right: 15%;
  animation: float 8s ease-in-out infinite reverse;
}

.orb-3 {
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, #D4AF37 0%, transparent 70%);
  top: 50%;
  right: 30%;
  animation: float 5s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0); }
  25% { transform: translate(20px, -20px); }
  50% { transform: translate(-10px, 10px); }
  75% { transform: translate(15px, 15px); }
}

.stat-item {
  animation: fadeIn 0.5s ease forwards;
  opacity: 0;
}

.stat-item:nth-child(1) { animation-delay: 0.2s; }
.stat-item:nth-child(2) { animation-delay: 0.4s; }
.stat-item:nth-child(3) { animation-delay: 0.6s; }

.feature-card {
  animation: slideUp 0.5s ease forwards;
  opacity: 0;
}

.feature-card:nth-child(1) { animation-delay: 0.1s; }
.feature-card:nth-child(2) { animation-delay: 0.2s; }
.feature-card:nth-child(3) { animation-delay: 0.3s; }
.feature-card:nth-child(4) { animation-delay: 0.4s; }
.feature-card:nth-child(5) { animation-delay: 0.5s; }
.feature-card:nth-child(6) { animation-delay: 0.6s; }

.tech-badge {
  animation: scaleIn 0.3s ease forwards;
}

@keyframes fadeIn {
  to { opacity: 1; }
}

@keyframes slideUp {
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scaleIn {
  to { 
    opacity: 1;
    transform: scale(1);
  }
}
</style>