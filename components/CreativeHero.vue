<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

const heroType = ref(0)
const canvasRef = ref(null)
const asciiRef = ref(null)
const typedText = ref('')
const fullText = 'Senior Staff Developer Relations Engineer, Applied AI @Block'
let animationFrameId
let resizeListener
let mouseMoveListener
const intervals = []

// --- Animation Logic ---
const heroDesigns = {
  1: () => {}, // CSS only
  2: () => { // Code Stream
    const canvas = canvasRef.value
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const characters = '01'
    const fontSize = 14
    const columns = canvas.width / fontSize
    const drops = Array.from({ length: columns }).fill(1)

    function draw() {
      ctx.fillStyle = 'rgba(13, 17, 23, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#4ECCA3'
      ctx.font = `${fontSize}px monospace`
      for (let i = 0; i < drops.length; i++) {
        const text = characters[Math.floor(Math.random() * characters.length)]
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975)
          drops[i] = 0
        drops[i]++
      }
    }
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      draw()
    }
    animate()
  },
  3: () => { // Typing Effect
    let i = 0
    const typingInterval = setInterval(() => {
      if (i < fullText.length) {
        typedText.value += fullText.charAt(i)
        i++
      }
      else {
        clearInterval(typingInterval)
      }
    }, 50)
    intervals.push(typingInterval)
  },
  4: () => {}, // CSS only
  5: () => { // Particle Plexus
    const canvas = canvasRef.value
    const ctx = canvas.getContext('2d')
    const mouse = { x: null, y: null }
    let particlesArray = []
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    mouseMoveListener = (event) => {
      mouse.x = event.x
      mouse.y = event.y
    }
    window.addEventListener('mousemove', mouseMoveListener)

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = 2
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
        ctx.fillStyle = '#4ECCA3'
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    const init = () => {
      particlesArray = []
      const num = (canvas.height * canvas.width) / 9000
      for (let i = 0; i < num; i++)
        particlesArray.push(new Particle())
    }
    const connect = () => {
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          const dist = ((particlesArray[a].x - particlesArray[b].x) ** 2) + ((particlesArray[a].y - particlesArray[b].y) ** 2)
          if (dist < 20000) {
            ctx.strokeStyle = `rgba(78, 204, 163, ${1 - (dist / 20000)})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y)
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y)
            ctx.stroke()
          }
        }
      }
    }
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particlesArray.forEach((p) => {
        p.update()
        p.draw()
      })
      connect()
      animationFrameId = requestAnimationFrame(animate)
    }
    init()
    animate()
    resizeListener = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      init()
    }
    window.addEventListener('resize', resizeListener)
  },
  6: () => { // Geometric Constellation
    const canvas = canvasRef.value
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const points = []
    const numPoints = 60
    for (let i = 0; i < numPoints; i++) {
      points.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: Math.random() * 0.4 - 0.2,
        vy: Math.random() * 0.4 - 0.2,
      })
    }
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.strokeStyle = 'rgba(78, 204, 163, 0.3)'
      for (let i = 0; i < numPoints; i++) {
        for (let j = i + 1; j < numPoints; j++) {
          const dist = Math.sqrt((points[i].x - points[j].x) ** 2 + (points[i].y - points[j].y) ** 2)
          if (dist < 200)
            ctx.stroke(new Path2D(`M${points[i].x} ${points[i].y} L${points[j].x} ${points[j].y}`))
        }
        points[i].x += points[i].vx
        points[i].y += points[i].vy
        if (points[i].x < 0 || points[i].x > canvas.width)
          points[i].vx *= -1
        if (points[i].y < 0 || points[i].y > canvas.height)
          points[i].vy *= -1
      }
    }
    const animate = () => {
      draw()
      animationFrameId = requestAnimationFrame(animate)
    }
    animate()
  },
  7: () => { // ASCII Art Reveal
    const targetText = `DEBBIE O'BRIEN`
    const chars = '!<>-_\\/[]{}—=+*^?#________'
    const el = asciiRef.value
    let frame = 0
    const animate = () => {
      const textArray = targetText.split('')
      const newText = textArray.map((char, i) => {
        if (i < frame)
          return targetText[i]
        return chars[Math.floor(Math.random() * chars.length)]
      }).join('')
      el.textContent = newText
      if (frame < targetText.length) {
        frame++
        animationFrameId = requestAnimationFrame(animate)
      }
    }
    animate()
  },
}

onMounted(() => {
  const availableDesigns = [1, 2, 3, 4, 5, 6, 7]
  heroType.value = availableDesigns[Math.floor(Math.random() * availableDesigns.length)]

  nextTick(() => {
    const initFunction = heroDesigns[heroType.value]
    if (initFunction) {
      initFunction()
    }
  })
})

onBeforeUnmount(() => {
  if (animationFrameId)
    cancelAnimationFrame(animationFrameId)
  intervals.forEach(clearInterval)
  if (resizeListener)
    window.removeEventListener('resize', resizeListener)
  if (mouseMoveListener)
    window.removeEventListener('mousemove', mouseMoveListener)
})
</script>

<template>
  <div class="hero-container bg-gray-900 text-white relative overflow-hidden">
    <!-- Canvas for Designs 2, 5, 6 -->
    <canvas
      v-if="[2, 5, 6].includes(heroType)"
      ref="canvasRef"
      class="absolute top-0 left-0 w-full h-full z-0"
    />

    <!-- Design 4: SVG Draw -->
    <div v-if="heroType === 4" class="svg-draw-container" aria-hidden="true">
      <svg viewBox="0 0 800 200">
        <path class="svg-path" d="M50 100 C 150 20, 250 180, 350 100 S 550 20, 650 100" stroke="white" stroke-width="2" fill="none" />
      </svg>
    </div>

    <!-- Main Content -->
    <div class="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
      <!-- Design 1: Glitching Text -->
      <div v-if="heroType === 1" class="glitch-wrapper" aria-hidden="true">
        <h1 class="glitch-text text-5xl md:text-7xl" data-text="Debbie O'Brien">
          Debbie O'Brien
        </h1>
      </div>

      <!-- Design 7: ASCII Art (replaces h1) -->
      <pre v-else-if="heroType === 7" ref="asciiRef" class="ascii-art-container" />

      <!-- Default Heading -->
      <h1 v-else class="text-5xl md:text-7xl font-bold text-white uppercase tracking-wider">
        Debbie <span class="text-primary">O'Brien</span>
      </h1>

      <!-- Subtitle (Now visible on ASCII design) -->
      <p class="mt-4 text-lg md:text-xl text-gray-300 max-w-2xl">
        <span v-if="heroType === 3" class="typing-text">{{ typedText }}</span>
        <span v-else>Senior Staff Developer Relations Engineer, Applied AI @Block</span>
      </p>

      <!-- Credentials/Badges -->
      <div class="mt-8 flex flex-wrap justify-center items-center gap-3 sm:gap-4">
        <a
          href="https://developers.google.com/community/experts/directory/profile/profile-debbie-o-brien"
          target="_blank"
          rel="nofollow noopener noreferrer"
          class="group inline-flex items-center gap-2 px-4 py-2 bg-gray-800/80 backdrop-blur-sm rounded-full border border-gray-700 hover:border-primary transition-all duration-300 hover:shadow-lg hover:scale-105"
        >
          <svg class="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 0C5.372 0 0 5.373 0 12s5.372 12 12 12 12-5.373 12-12S18.628 0 12 0zm0 19.5c-4.142 0-7.5-3.358-7.5-7.5S7.858 4.5 12 4.5s7.5 3.358 7.5 7.5-3.358 7.5-7.5 7.5z" />
          </svg>
          <span class="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">Google GDE</span>
        </a>

        <a
          href="https://mvp.microsoft.com/en-us"
          target="_blank"
          rel="nofollow noopener noreferrer"
          class="group inline-flex items-center gap-2 px-4 py-2 bg-gray-800/80 backdrop-blur-sm rounded-full border border-gray-700 hover:border-primary transition-all duration-300 hover:shadow-lg hover:scale-105"
        >
          <svg class="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2L9.5 8.5L3 9.5L7.5 14L6.5 20.5L12 17.5L17.5 20.5L16.5 14L21 9.5L14.5 8.5L12 2Z" />
          </svg>
          <span class="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">Former Microsoft MVP</span>
        </a>

        <a
          href="https://stars.github.com/alumni/"
          target="_blank"
          rel="nofollow noopener noreferrer"
          class="group inline-flex items-center gap-2 px-4 py-2 bg-gray-800/80 backdrop-blur-sm rounded-full border border-gray-700 hover:border-primary transition-all duration-300 hover:shadow-lg hover:scale-105"
        >
          <svg class="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2L9.5 8.5L3 9.5L7.5 14L6.5 20.5L12 17.5L17.5 20.5L16.5 14L21 9.5L14.5 8.5L12 2Z" />
          </svg>
          <span class="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">GitHub Star Alumni</span>
        </a>

        <a
          href="https://nuxtjs.org/teams/"
          target="_blank"
          rel="nofollow noopener noreferrer"
          class="group inline-flex items-center gap-2 px-4 py-2 bg-gray-800/80 backdrop-blur-sm rounded-full border border-gray-700 hover:border-primary transition-all duration-300 hover:shadow-lg hover:scale-105"
        >
          <svg class="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2L9.5 8.5L3 9.5L7.5 14L6.5 20.5L12 17.5L17.5 20.5L16.5 14L21 9.5L14.5 8.5L12 2Z" />
          </svg>
          <span class="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">Nuxt Ambassador</span>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hero-container { height: 50vh; min-height: 300px; display: flex; align-items: center; justify-content: center; }

/* Design 1: Glitch */
.glitch-wrapper { text-align: center; }
.glitch-text { font-weight: bold; text-transform: uppercase; position: relative; color: white; }
.glitch-text::before, .glitch-text::after { content: attr(data-text); position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: #0d1117; overflow: hidden; }
.glitch-text::before { left: 2px; text-shadow: -2px 0 #ff00c1; animation: glitch-anim-1 2.5s infinite linear reverse; }
.glitch-text::after { left: -2px; text-shadow: -2px 0 #00fff9; animation: glitch-anim-2 2.5s infinite linear reverse; }
@keyframes glitch-anim-1 { 0%, 10%, 100% { clip-path: inset(0 0 95% 0); } 20%, 40% { clip-path: inset(40% 0 56% 0); } 60%, 80% { clip-path: inset(80% 0 10% 0); } }
@keyframes glitch-anim-2 { 0%, 10%, 100% { clip-path: inset(95% 0 0 0); } 20%, 40% { clip-path: inset(0 0 40% 0); } 60%, 80% { clip-path: inset(10% 0 80% 0); } }

/* Design 3: Typing Effect */
.typing-text::after { content: '|'; animation: blink 0.7s infinite; color: #4ECCA3; }
@keyframes blink { 50% { opacity: 0; } }

/* Design 4: SVG Draw */
.svg-draw-container { position: absolute; width: 80%; max-width: 800px; }
.svg-path { stroke-dasharray: 1000; stroke-dashoffset: 1000; animation: draw 5s ease-in-out forwards; }
@keyframes draw { to { stroke-dashoffset: 0; } }

/* Design 7: ASCII Art */
.ascii-art-container { font-family: monospace; color: #4ECCA3; font-size: 2.25rem; text-align: center; line-height: 1; margin-bottom: 0.5rem; }
</style>
