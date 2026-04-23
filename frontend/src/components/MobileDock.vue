<template>
  <nav class="glass border-t border-t-burme-gold/10 px-2 py-2 bg-[#0A0A0A]/95 backdrop-blur-xl">
    <div class="flex justify-around items-center">
      <button
        v-for="item in dockItems"
        :key="item.path"
        @click="navigate(item.path)"
        class="dock-item flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300"
        :class="{ 'active': isActive(item.path) }"
      >
        <div class="dock-icon-wrapper relative">
          <i :class="item.icon" class="text-xl transition-transform duration-300"></i>
          <span v-if="item.badge" class="absolute -top-1 -right-1 w-2 h-2 bg-burme-gold rounded-full"></span>
        </div>
        <span class="text-xs mt-1 font-medium">{{ item.label }}</span>
      </button>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const dockItems = [
  { path: '/', label: 'Home', icon: 'bi bi-house' },
  { path: '/chat', label: 'Chat', icon: 'bi bi-chat-dots', badge: false },
  { path: '/dashboard', label: 'Stats', icon: 'bi bi-graph-up' },
  { path: '/docs', label: 'Docs', icon: 'bi bi-book' },
  { path: '/about', label: 'About', icon: 'bi bi-info-circle' }
]

const isActive = (path) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}

function navigate(path) {
  router.push(path)
}
</script>

<style scoped>
.dock-item {
  @apply text-burme-light/60;
  min-width: 60px;
  min-height: 60px;
}

.dock-item:active {
  transform: scale(0.95);
}

.dock-item.active {
  @apply text-burme-gold;
}

.dock-item.active .dock-icon-wrapper::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  background: #D4AF37;
  border-radius: 50%;
}

.dock-icon-wrapper {
  position: relative;
  transition: transform 0.3s ease;
}

.dock-item:hover .dock-icon-wrapper {
  transform: translateY(-2px);
}

.dock-item.active .dock-icon-wrapper {
  transform: scale(1.1);
}
</style>