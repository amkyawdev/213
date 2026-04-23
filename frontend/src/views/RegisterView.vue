<template>
  <div class="auth-container min-h-screen flex items-center justify-center p-4">
    <div class="auth-card glass-light rounded-2xl p-8 max-w-md w-full gold-border animate-scale-in">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="w-16 h-16 rounded-2xl bg-gradient-gold flex items-center justify-center mx-auto mb-4">
          <span class="text-burme-black font-bold text-3xl heading-font">B</span>
        </div>
        <h1 class="heading-font text-3xl font-bold golden-text">Create Account</h1>
        <p class="text-burme-light/60 mt-2">Join Burme AI and start chatting</p>
      </div>

      <!-- Error Alert -->
      <div v-if="authStore.error" class="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
        <i class="bi bi-exclamation-circle mr-2"></i>
        {{ authStore.error }}
      </div>

      <!-- Register Form -->
      <form @submit.prevent="handleRegister" class="space-y-5">
        <div>
          <label class="block text-sm text-burme-light/60 mb-2">Username</label>
          <input 
            v-model="form.username"
            type="text" 
            required
            minlength="3"
            class="w-full px-4 py-3 rounded-xl"
            placeholder="Choose a username"
          />
        </div>
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
              minlength="8"
              class="w-full px-4 py-3 pr-12 rounded-xl"
              placeholder="Create a password"
            />
            <button 
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-burme-light/40 hover:text-burme-light"
            >
              <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
            </button>
          </div>
          <p class="text-xs text-burme-light/40 mt-2">Minimum 8 characters</p>
        </div>
        <div>
          <label class="block text-sm text-burme-light/60 mb-2">Confirm Password</label>
          <input 
            v-model="form.confirmPassword"
            :type="showPassword ? 'text' : 'password'"
            required
            class="w-full px-4 py-3 rounded-xl"
            placeholder="Confirm your password"
          />
        </div>
        <PremiumButton 
          type="submit" 
          variant="primary" 
          size="lg" 
          class="w-full"
          icon="bi bi-person-plus"
          :loading="authStore.loading"
        >
          Create Account
        </PremiumButton>
      </form>

      <!-- Terms -->
      <p class="text-xs text-center text-burme-light/40 mt-6">
        By creating an account, you agree to our 
        <a href="#" class="text-burme-gold hover:underline">Terms of Service</a> 
        and 
        <a href="#" class="text-burme-gold hover:underline">Privacy Policy</a>
      </p>

      <!-- Divider -->
      <div class="flex items-center gap-4 my-8">
        <div class="flex-1 h-px bg-burme-gold/20"></div>
        <span class="text-burme-light/40 text-sm">or</span>
        <div class="flex-1 h-px bg-burme-gold/20"></div>
      </div>

      <!-- Login Link -->
      <p class="text-center text-burme-light/60">
        Already have an account?
        <router-link to="/login" class="text-burme-gold hover:underline font-medium">Sign in</router-link>
      </p>

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
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const showPassword = ref(false)

async function handleRegister() {
  if (form.value.password !== form.value.confirmPassword) {
    authStore.error = 'Passwords do not match'
    return
  }

  if (form.value.password.length < 8) {
    authStore.error = 'Password must be at least 8 characters'
    return
  }

  const success = await authStore.register(
    form.value.username,
    form.value.email,
    form.value.password
  )
  
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