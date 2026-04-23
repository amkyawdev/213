<template>
  <div class="min-h-screen bg-burme-black">
    <!-- Three.js Particle Canvas -->
    <canvas id="particle-canvas"></canvas>
    
    <!-- Desktop Navigation (Hidden on Mobile) -->
    <DesktopNav class="desktop-nav hidden md:block" @toggle="toggleNav" :collapsed="navCollapsed" />
    
    <!-- Mobile Bottom Dock (Hidden on Desktop) -->
    <MobileDock class="mobile-dock fixed bottom-0 left-0 right-0 z-[9999] md:hidden" />
    
    <!-- Main Content (Full width on mobile with bottom dock padding, sidebar margin on desktop) -->
    <main 
      class="transition-all duration-300 ease-in-out w-full pb-20 md:pb-0 md:ml-[280px]"
      :class="{ 'md:ml-20': navCollapsed }"
    >
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import DesktopNav from './components/DesktopNav.vue'
import MobileDock from './components/MobileDock.vue'
import { useParticleSystem } from './composables/useParticleSystem'

const navCollapsed = ref(false)
const { initCanvas, emitParticles, cleanup } = useParticleSystem()

function toggleNav() {
  navCollapsed.value = !navCollapsed.value
}

// Expose emitParticles globally for button components
window.emitBurmeParticles = emitParticles

onMounted(() => {
  initCanvas()
  
  // Global click handler for particle effects
  document.addEventListener('click', (e) => {
    if (e.target.closest('.particle-trigger')) {
      emitParticles(e.clientX, e.clientY)
    }
  })
})

onUnmounted(() => {
  cleanup()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>