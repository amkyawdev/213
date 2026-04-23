<template>
  <nav 
    class="h-full glass border-r border-r-burme-gold/10 flex flex-col"
    :class="{ 'collapsed': collapsed }"
  >
    <!-- Logo Section -->
    <div class="p-5 border-b border-b-burme-gold/10">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-gradient-gold flex items-center justify-center flex-shrink-0">
          <span class="text-burme-black font-bold text-xl heading-font">B</span>
        </div>
        <transition name="fade">
          <div v-if="!collapsed" class="overflow-hidden">
            <h1 class="golden-text heading-font text-xl font-bold whitespace-nowrap">Burme AI</h1>
            <p class="text-xs text-burme-light/60">Premium Intelligence</p>
          </div>
        </transition>
      </div>
    </div>

    <!-- Navigation Toggle -->
    <button 
      @click="$emit('toggle')"
      class="absolute -right-3 top-20 w-6 h-6 rounded-full bg-burme-gold flex items-center justify-center shadow-gold-glow hover:scale-110 transition-transform z-10"
    >
      <i :class="collapsed ? 'bi-chevron-right' : 'bi-chevron-left'" class="text-burme-black text-xs"></i>
    </button>

    <!-- Navigation Links -->
    <div class="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
      <router-link 
        v-for="item in navItems" 
        :key="item.path"
        :to="item.path"
        class="nav-link flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group"
        :class="{ 'justify-center': collapsed }"
      >
        <i :class="item.icon" class="text-xl group-hover:scale-110 transition-transform"></i>
        <transition name="fade">
          <span v-if="!collapsed" class="font-medium whitespace-nowrap">{{ item.label }}</span>
        </transition>
      </router-link>
    </div>

    <!-- User Section -->
    <div class="p-4 border-t border-t-burme-gold/10">
      <div 
        class="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-burme-gray/30 transition-colors cursor-pointer"
        :class="{ 'justify-center': collapsed }"
      >
        <div class="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center flex-shrink-0">
          <span class="text-burme-black font-semibold">{{ userInitial }}</span>
        </div>
        <transition name="fade">
          <div v-if="!collapsed" class="flex-1 min-w-0">
            <p class="font-medium truncate">{{ authStore.user?.username || 'Guest' }}</p>
            <p class="text-xs text-burme-light/60 capitalize">{{ authStore.user?.role || 'Not logged in' }}</p>
          </div>
        </transition>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

defineProps({
  collapsed: {
    type: Boolean,
    default: false
  }
})

defineEmits(['toggle'])

const authStore = useAuthStore()

const navItems = [
  { path: '/', label: 'Home', icon: 'bi bi-house' },
  { path: '/chat', label: 'Chat', icon: 'bi bi-chat-dots' },
  { path: '/dashboard', label: 'Dashboard', icon: 'bi bi-graph-up' },
  { path: '/docs', label: 'Documentation', icon: 'bi bi-book' },
  { path: '/about', label: 'About', icon: 'bi bi-info-circle' }
]

const userInitial = computed(() => {
  const username = authStore.user?.username || 'G'
  return username.charAt(0).toUpperCase()
})
</script>

<style scoped>
.nav-link {
  @apply text-burme-light/80 hover:text-burme-gold hover:bg-burme-gold/5;
}

.nav-link.router-link-active {
  @apply text-burme-gold bg-burme-gold/10;
  background: linear-gradient(90deg, rgba(212, 175, 55, 0.15) 0%, transparent 100%);
}

.nav-link.router-link-active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 60%;
  background: linear-gradient(180deg, #D4AF37, #F1D592);
  border-radius: 0 2px 2px 0;
}

.collapsed .nav-link {
  @apply relative;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>