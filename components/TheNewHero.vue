<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const particleCanvas = ref(null)
let animationFrameId

onMounted(() => {
  const canvas = particleCanvas.value
  const ctx = canvas.getContext('2d')
  let particles = []

  const resizeCanvas = () => {
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
  }

  window.addEventListener('resize', resizeCanvas)
  resizeCanvas()

  const particleColor = '#4ECCA3' // Using a color that can be associated with your 'primary' color

  class Particle {
    constructor(x, y) {
      this.x = x
      this.y = y
      this.size = Math.random() * 2 + 1
      this.speedX = Math.random() * 2 - 1
      this.speedY = Math.random() * 2 - 1
    }

    update() {
      if (this.x > canvas.width || this.x < 0)
        this.speedX *= -1
      if (this.y > canvas.height || this.y < 0)
        this.speedY *= -1
      this.x += this.speedX
      this.y += this.speedY
    }

    draw() {
      ctx.fillStyle = particleColor
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  const initParticles = () => {
    particles = []
    const numberOfParticles = (canvas.width * canvas.height) / 9000
    for (let i = 0; i < numberOfParticles; i++) {
      particles.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height))
    }
  }

  const connectParticles = () => {
    let opacityValue = 1
    for (let a = 0; a < particles.length; a++) {
      for (let b = a; b < particles.length; b++) {
        const distance = Math.sqrt(
          (particles[a].x - particles[b].x) ** 2 + (particles[a].y - particles[b].y) ** 2,
        )
        if (distance < 100) {
          opacityValue = 1 - (distance / 100)
          ctx.strokeStyle = `rgba(78, 204, 163, ${opacityValue})`
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(particles[a].x, particles[a].y)
          ctx.lineTo(particles[b].x, particles[b].y)
          ctx.stroke()
        }
      }
    }
  }

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    particles.forEach((p) => {
      p.update()
      p.draw()
    })
    connectParticles()
    animationFrameId = requestAnimationFrame(animate)
  }

  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

  const handleMotionChange = (e) => {
    if (e.matches) {
      cancelAnimationFrame(animationFrameId)
    }
    else {
      initParticles()
      animate()
    }
  }

  motionQuery.addEventListener('change', handleMotionChange)

  // Initial check
  if (!motionQuery.matches) {
    initParticles()
    animate()
  }

  onBeforeUnmount(() => {
    cancelAnimationFrame(animationFrameId)
    window.removeEventListener('resize', resizeCanvas)
    motionQuery.removeEventListener('change', handleMotionChange)
  })
})
</script>

<template>
  <div class="relative hero-container bg-gray-900 text-white">
    <canvas ref="particleCanvas" class="absolute top-0 left-0 w-full h-full z-0" />
    <div class="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
      <h1 class="text-5xl md:text-7xl font-bold text-white uppercase tracking-wider">
        Debbie <span class="text-primary">O'Brien</span>
      </h1>
      <p class="mt-4 text-lg md:text-xl text-gray-300 max-w-2xl">
        Principal Technical Program Manager at Microsoft, Google Developer Expert, and a passion for helping others learn through my content.
      </p>
    </div>
  </div>
</template>

<style scoped>
.hero-container {
  height: 70vh;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
