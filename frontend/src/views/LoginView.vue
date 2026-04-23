<template>
  <div class="auth-container min-h-screen flex items-center justify-center p-4">
    <div class="auth-card glass-light rounded-2xl p-8 max-w-md w-full gold-border animate-scale-in">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="w-16 h-16 rounded-2xl bg-gradient-gold flex items-center justify-center mx-auto mb-4">
          <span class="text-burme-black font-bold text-3xl heading-font">B</span>
        </div>
        <h1 class="heading-font text-3xl font-bold golden-text">Welcome Back</h1>
        <p class="text-burme-light/60 mt-2">Sign in to continue to Burme AI</p>
      </div>

      <!-- Error Alert -->
      <div v-if="authStore.error" class="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
        <i class="bi bi-exclamation-circle mr-2"></i>
        {{ authStore.error }}
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-sm text-burme-light/60 mb-2">Email</label>
          <input 
            v-model="form.email"
            type="email" 
            required
            class="w-full px-4 py-3 rounded-xl"
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label class="block text-sm text-burme-light/60 mb-2">Password</label>
          <div class="relative">
            <input 
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              required
              class="w-full px-4 py-3 pr-12 rounded-xl"
              placeholder="Enter your password"
            />
            <button 
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-burme-light/40 hover:text-burme-light"
            >
              <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
            </button>
          </div>
        </div>
        <PremiumButton 
          type="submit" 
          variant="primary" 
          size="lg" 
          class="w-full"
          icon="bi bi-box-arrow-in-right"
          :loading="authStore.loading"
        >
          Sign In
        </PremiumButton>
      </form>

      <!-- Back to Home -->
      <div class="mt-6 text-center">
        <router-link to="/" class="text-burme-light/40 hover:text-burme-gold text-sm">
          <i class="bi bi-arrow-left mr-2"></i>
          Back to Home
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import PremiumButton from '@/components/PremiumButton.vue'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  email: '',
  password: ''
})

const showPassword = ref(false)

async function handleLogin() {
  const success = await authStore.login(form.value.email, form.value.password)
  if (success) {
    router.push('/chat')
  }
}
</script>

<style scoped>
.auth-container {
  background: linear-gradient(180deg, #0A0A0A 0%, #111111 100%);
  min-height: 100vh;
}

.auth-card {
  animation: scaleIn 0.3s ease forwards;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>