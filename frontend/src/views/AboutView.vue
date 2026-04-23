<template>
  <div class="about-container min-h-screen">
    <!-- Hero Section -->
    <section class="py-20 px-4 text-center">
      <div class="max-w-4xl mx-auto">
        <div class="w-24 h-24 rounded-2xl bg-gradient-gold flex items-center justify-center mx-auto mb-8 shadow-gold-glow-lg">
          <span class="text-burme-black font-bold text-4xl heading-font">B</span>
        </div>
        <h1 class="heading-font text-5xl font-bold golden-text mb-4">About Burme AI</h1>
        <p class="text-xl text-burme-light/70 mb-8">
          Premium AI Solutions for the Modern World
        </p>
        <div class="flex justify-center gap-4">
          <PremiumButton variant="primary" icon="bi bi-chat-dots" @click="$router.push('/chat')">
            Try Now
          </PremiumButton>
          <PremiumButton variant="outline" icon="bi bi-envelope" @click="showContact = true">
            Contact Us
          </PremiumButton>
        </div>
      </div>
    </section>

    <!-- Mission Section -->
    <section class="py-16 px-4 bg-burme-gray/30">
      <div class="max-w-4xl mx-auto">
        <h2 class="heading-font text-3xl font-bold text-center mb-8 golden-text">Our Mission</h2>
        <div class="glass-light rounded-2xl p-8 gold-border">
          <p class="text-lg text-burme-light/80 leading-relaxed mb-4">
            Burme AI was founded with a singular vision: to make advanced AI accessible to everyone without compromising on speed, reliability, or quality.
          </p>
          <p class="text-lg text-burme-light/80 leading-relaxed">
            We leverage cutting-edge infrastructure and a smart multi-provider routing system to deliver instant, reliable AI responses. Our commitment to excellence drives us to continuously innovate and improve.
          </p>
        </div>
      </div>
    </section>

    <!-- Features Grid -->
    <section class="py-16 px-4">
      <div class="max-w-6xl mx-auto">
        <h2 class="heading-font text-3xl font-bold text-center mb-12 golden-text">Why Burme AI?</h2>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="feature in features" :key="feature.title" class="glass-light rounded-2xl p-6 gold-border text-center hover:scale-105 transition-transform">
            <div class="w-16 h-16 rounded-2xl bg-gradient-gold flex items-center justify-center mx-auto mb-4">
              <i :class="feature.icon" class="text-2xl text-burme-black"></i>
            </div>
            <h3 class="font-semibold text-lg mb-2 text-burme-gold">{{ feature.title }}</h3>
            <p class="text-burme-light/60 text-sm">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="py-16 px-4 bg-burme-gray/30">
      <div class="max-w-5xl mx-auto">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div v-for="stat in stats" :key="stat.label" class="text-center">
            <div class="text-4xl md:text-5xl font-bold golden-text mb-2">{{ stat.value }}</div>
            <div class="text-burme-light/60">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Modal -->
    <div v-if="showContact" class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" @click.self="showContact = false">
      <div class="glass-light rounded-2xl p-8 max-w-md w-full gold-border animate-scale-in">
        <div class="flex justify-between items-center mb-6">
          <h3 class="heading-font text-2xl font-bold golden-text">Contact Us</h3>
          <button @click="showContact = false" class="text-burme-light/60 hover:text-white">
            <i class="bi bi-x-lg text-xl"></i>
          </button>
        </div>
        <form @submit.prevent="submitContact" class="space-y-4">
          <div>
            <label class="block text-sm text-burme-light/60 mb-2">Name</label>
            <input v-model="contactForm.name" type="text" required class="w-full" />
          </div>
          <div>
            <label class="block text-sm text-burme-light/60 mb-2">Email</label>
            <input v-model="contactForm.email" type="email" required class="w-full" />
          </div>
          <div>
            <label class="block text-sm text-burme-light/60 mb-2">Message</label>
            <textarea v-model="contactForm.message" rows="4" required class="w-full"></textarea>
          </div>
          <PremiumButton type="submit" variant="primary" class="w-full" icon="bi bi-send">
            Send Message
          </PremiumButton>
        </form>
      </div>
    </div>

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
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import PremiumButton from '@/components/PremiumButton.vue'

const showContact = ref(false)
const contactForm = ref({ name: '', email: '', message: '' })

const features = [
  { icon: 'bi bi-lightning-charge', title: 'Lightning Fast', description: 'Sub-second response times powered by Cerebras infrastructure' },
  { icon: 'bi bi-shield-check', title: '99.9% Uptime', description: 'Smart failover ensures uninterrupted service' },
  { icon: 'bi bi-cpu', title: 'Advanced Models', description: 'Access to state-of-the-art Llama 3.1 models' },
  { icon: 'bi bi-palette', title: 'Premium Design', description: 'Beautiful black & gold interface with micro-interactions' },
  { icon: 'bi bi-lock', title: 'Secure & Private', description: 'Your data is encrypted and protected' },
  { icon: 'bi bi-headset', title: '24/7 Support', description: 'Our team is always here to help' }
]

const stats = [
  { value: '10K+', label: 'Active Users' },
  { value: '1M+', label: 'Chat Messages' },
  { value: '99.9%', label: 'Uptime' },
  { value: '<200ms', label: 'Avg Response' }
]

function submitContact() {
  // In production, this would send to an API
  alert('Thank you for your message! We will get back to you soon.')
  showContact.value = false
  contactForm.value = { name: '', email: '', message: '' }
}
</script>

<style scoped>
.about-container {
  background: linear-gradient(180deg, #0A0A0A 0%, #111111 100%);
  min-height: 100vh;
}
</style>