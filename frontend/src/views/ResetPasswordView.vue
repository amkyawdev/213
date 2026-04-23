<template>
  <div class="auth-container min-h-screen flex items-center justify-center p-4">
    <div class="auth-card glass-light rounded-2xl p-8 max-w-md w-full gold-border animate-scale-in">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="w-16 h-16 rounded-2xl bg-gradient-gold flex items-center justify-center mx-auto mb-4">
          <span class="text-burme-black font-bold text-3xl heading-font">B</span>
        </div>
        <h1 class="heading-font text-3xl font-bold golden-text">Reset Password</h1>
        <p class="text-burme-light/60 mt-2">Enter your email to reset password</p>
      </div>

      <!-- Error Alert -->
      <div v-if="error" class="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
        <i class="bi bi-exclamation-circle mr-2"></i>
        {{ error }}
      </div>

      <!-- Success Alert -->
      <div v-if="success" class="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
        <i class="bi bi-check-circle mr-2"></i>
        {{ success }}
      </div>

      <!-- Reset Form -->
      <form v-if="!success" @submit.prevent="handleReset" class="space-y-5">
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
        <PremiumButton 
          type="submit" 
          variant="primary" 
          size="lg" 
          class="w-full"
          icon="bi bi-envelope"
          :loading="loading"
        >
          Send Reset Link
        </PremiumButton>
      </form>

      <!-- Back to Login -->
      <div class="mt-6 text-center">
        <router-link to="/login" class="text-burme-light/40 hover:text-burme-gold text-sm">
          <i class="bi bi-arrow-left mr-2"></i>
          Back to Login
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import PremiumButton from '@/components/PremiumButton.vue'

const form = ref({
  email: ''
})

const error = ref('')
const success = ref('')
const loading = ref(false)

async function handleReset() {
  error.value = ''
  success.value = ''
  loading.value = true

  // Simulate password reset
  // In production, connect to Firebase Auth
  setTimeout(() => {
    success.value = 'Password reset link sent to your email!'
    loading.value = false
  }, 1500)
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