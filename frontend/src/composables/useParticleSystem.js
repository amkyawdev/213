import { ref, onMounted, onUnmounted } from 'vue'

export function useParticleSystem() {
  const canvas = ref(null)
  const ctx = ref(null)
  const particles = ref([])
  const animationId = ref(null)

  class Particle {
    constructor(x, y) {
      this.x = x
      this.y = y
      this.vx = (Math.random() - 0.5) * 15
      this.vy = (Math.random() - 0.5) * 15 - 5
      this.gravity = 0.3
      this.life = 1
      this.decay = 0.02 + Math.random() * 0.02
      this.size = 2 + Math.random() * 4
      this.color = Math.random() > 0.3 ? '#D4AF37' : '#F1D592'
      this.rotation = Math.random() * Math.PI * 2
      this.rotationSpeed = (Math.random() - 0.5) * 0.2
    }

    update() {
      this.vy += this.gravity
      this.x += this.vx
      this.y += this.vy
      this.life -= this.decay
      this.rotation += this.rotationSpeed
      this.size *= 0.98
    }

    draw(ctx) {
      if (this.life <= 0) return
      
      ctx.save()
      ctx.translate(this.x, this.y)
      ctx.rotate(this.rotation)
      ctx.globalAlpha = this.life
      
      // Draw diamond shape
      ctx.fillStyle = this.color
      ctx.shadowColor = this.color
      ctx.shadowBlur = 10
      
      ctx.beginPath()
      ctx.moveTo(0, -this.size)
      ctx.lineTo(this.size * 0.6, 0)
      ctx.lineTo(0, this.size)
      ctx.lineTo(-this.size * 0.6, 0)
      ctx.closePath()
      ctx.fill()
      
      ctx.restore()
    }
  }

  function initCanvas() {
    const canvasEl = document.getElementById('particle-canvas')
    if (!canvasEl) return
    
    canvas.value = canvasEl
    ctx.value = canvasEl.getContext('2d')
    
    function resizeCanvas() {
      if (canvas.value) {
        canvas.value.width = window.innerWidth
        canvas.value.height = window.innerHeight
      }
    }
    
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    animate()
  }

  function emitParticles(x, y, count = 30) {
    if (!ctx.value) return
    
    for (let i = 0; i < count; i++) {
      particles.value.push(new Particle(x, y))
    }
  }

  function animate() {
    if (!ctx.value || !canvas.value) return
    
    ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height)
    
    particles.value = particles.value.filter(p => p.life > 0)
    
    for (const particle of particles.value) {
      particle.update()
      particle.draw(ctx.value)
    }
    
    animationId.value = requestAnimationFrame(animate)
  }

  function cleanup() {
    if (animationId.value) {
      cancelAnimationFrame(animationId.value)
    }
    particles.value = []
  }

  return {
    initCanvas,
    emitParticles,
    cleanup
  }
}

export function useButton3DEffect(elementRef) {
  const tiltX = ref(0)
  const tiltY = ref(0)
  const glowIntensity = ref(0)

  function handleMouseMove(event) {
    if (!elementRef.value) return
    
    const rect = elementRef.value.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    
    tiltX.value = ((y - centerY) / centerY) * 8
    tiltY.value = -((x - centerX) / centerX) * 8
    glowIntensity.value = 1
  }

  function handleMouseLeave() {
    tiltX.value = 0
    tiltY.value = 0
    glowIntensity.value = 0
  }

  function applyStyles() {
    if (!elementRef.value) return
    
    elementRef.value.style.transform = `
      perspective(1000px)
      rotateX(${tiltX.value}deg)
      rotateY(${tiltY.value}deg)
      scale3d(1.02, 1.02, 1.02)
    `
    elementRef.value.style.boxShadow = `
      ${10 + glowIntensity.value * 20}px ${10 + glowIntensity.value * 20}px ${30 + glowIntensity.value * 20}px 
      rgba(212, 175, 55, ${0.2 + glowIntensity.value * 0.3})
    `
  }

  return {
    tiltX,
    tiltY,
    glowIntensity,
    handleMouseMove,
    handleMouseLeave,
    applyStyles
  }
}