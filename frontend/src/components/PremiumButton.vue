<template>
  <button
    ref="buttonRef"
    @click="handleClick"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
    class="premium-button particle-trigger relative overflow-hidden transition-all duration-300"
    :class="[variant, size, { 'disabled': disabled, 'loading': loading }]"
  >
    <!-- Shine Effect -->
    <div class="shine-effect"></div>
    
    <!-- Content -->
    <span class="relative z-10 flex items-center justify-center gap-2">
      <i v-if="icon && !loading" :class="icon" class="text-lg"></i>
      <span v-if="loading" class="loading-spinner"></span>
      <slot></slot>
    </span>
  </button>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary' // primary, secondary, outline, ghost
  },
  size: {
    type: String,
    default: 'md' // sm, md, lg
  },
  icon: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])
const buttonRef = ref(null)

let tiltX = 0
let tiltY = 0
let glowIntensity = 0

function handleMouseMove(event) {
  if (!buttonRef.value || props.disabled || props.loading) return
  
  const rect = buttonRef.value.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  
  const centerX = rect.width / 2
  const centerY = rect.height / 2
  
  tiltX = ((y - centerY) / centerY) * 10
  tiltY = -((x - centerX) / centerX) * 10
  glowIntensity = 1
  
  applyTiltEffect()
}

function handleMouseLeave() {
  if (!buttonRef.value) return
  
  tiltX = 0
  tiltY = 0
  glowIntensity = 0
  
  buttonRef.value.style.transform = ''
  buttonRef.value.style.boxShadow = ''
}

function applyTiltEffect() {
  if (!buttonRef.value) return
  
  buttonRef.value.style.transform = `
    perspective(1000px)
    rotateX(${tiltX}deg)
    rotateY(${tiltY}deg)
    scale3d(1.02, 1.02, 1.02)
  `
  
  const shadowIntensity = 10 + glowIntensity * 30
  const shadowBlur = 20 + glowIntensity * 30
  buttonRef.value.style.boxShadow = `
    ${shadowIntensity}px ${shadowIntensity}px ${shadowBlur}px 
    rgba(212, 175, 55, ${0.2 + glowIntensity * 0.3})
  `
}

function handleClick(event) {
  if (props.disabled || props.loading) return
  
  // Trigger particle effect
  if (window.emitBurmeParticles) {
    window.emitBurmeParticles(event.clientX, event.clientY, 25)
  }
  
  emit('click', event)
}

watch(() => props.disabled, (disabled) => {
  if (disabled && buttonRef.value) {
    buttonRef.value.style.transform = ''
    buttonRef.value.style.boxShadow = ''
  }
})
</script>

<style scoped>
.premium-button {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  border-radius: 12px;
  cursor: pointer;
  position: relative;
  transform-style: preserve-3d;
  will-change: transform, box-shadow;
}

/* Variants */
.premium-button.primary {
  background: linear-gradient(135deg, #D4AF37 0%, #F1D592 50%, #D4AF37 100%);
  color: #0A0A0A;
  border: none;
  background-size: 200% 200%;
  animation: gradientShift 3s ease infinite;
}

.premium-button.primary:hover:not(.disabled):not(.loading) {
  box-shadow: 0 10px 40px rgba(212, 175, 55, 0.4);
}

.premium-button.secondary {
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(241, 213, 146, 0.1) 100%);
  color: #D4AF37;
  border: 2px solid rgba(212, 175, 55, 0.4);
}

.premium-button.secondary:hover:not(.disabled):not(.loading) {
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.3) 0%, rgba(241, 213, 146, 0.2) 100%);
  border-color: #D4AF37;
}

.premium-button.outline {
  background: transparent;
  color: #D4AF37;
  border: 2px solid #D4AF37;
}

.premium-button.outline:hover:not(.disabled):not(.loading) {
  background: rgba(212, 175, 55, 0.1);
  box-shadow: 0 0 20px rgba(212, 175, 55, 0.2);
}

.premium-button.ghost {
  background: transparent;
  color: #E5E5E5;
  border: none;
}

.premium-button.ghost:hover:not(.disabled):not(.loading) {
  color: #D4AF37;
  background: rgba(212, 175, 55, 0.1);
}

/* Sizes */
.premium-button.sm {
  padding: 8px 16px;
  font-size: 0.875rem;
}

.premium-button.md {
  padding: 12px 24px;
  font-size: 1rem;
}

.premium-button.lg {
  padding: 16px 32px;
  font-size: 1.125rem;
}

/* States */
.premium-button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.premium-button.loading {
  pointer-events: none;
}

/* Shine Effect */
.shine-effect {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  pointer-events: none;
}

.premium-button:hover .shine-effect {
  animation: shine 0.6s ease forwards;
}

/* Loading Spinner */
.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

/* Animations */
@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

@keyframes shine {
  0% { left: -100%; }
  100% { left: 100%; }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>