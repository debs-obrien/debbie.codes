<template>
  <section
    class="hero-spotlight relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen bg-dark text-white overflow-hidden"
    aria-label="Introduction"
  >
    <div class="hero-atmosphere absolute inset-0 pointer-events-none" aria-hidden="true">
      <div class="hero-glow hero-glow-main" />
      <div class="hero-glow hero-glow-soft" />
      <div class="hero-grid-lines" />
    </div>

    <div class="relative z-10 flex flex-col items-center justify-center text-center px-6 sm:px-10 py-16 sm:py-20 lg:py-24 min-h-[min(56vh,520px)]">
      <h1 class="hero-animate hero-animate-1 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold uppercase tracking-wider leading-none">
        Debbie <span class="text-primary">O'Brien</span>
      </h1>

      <div class="hero-animate hero-animate-2 hero-rule mt-6" aria-hidden="true" />

      <p class="hero-animate hero-animate-2 mt-5 text-lg md:text-xl text-gray-300 max-w-2xl">
        Platform Engineer – Applied AI at Zephyr Cloud
      </p>

      <div class="hero-animate hero-animate-3 mt-8 flex flex-wrap justify-center items-center gap-3">
        <a
          href="https://me.developers.google.com/u/115790798136433531532"
          target="_blank"
          rel="nofollow noopener noreferrer"
          class="badge-link"
        >
          <svg class="w-4 h-4 text-primary shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 0C5.372 0 0 5.373 0 12s5.372 12 12 12 12-5.373 12-12S18.628 0 12 0zm0 19.5c-4.142 0-7.5-3.358-7.5-7.5S7.858 4.5 12 4.5s7.5 3.358 7.5 7.5-3.358 7.5-7.5 7.5z" />
          </svg>
          <span>Google GDE</span>
        </a>

        <a
          href="https://mvp.microsoft.com/en-us"
          target="_blank"
          rel="nofollow noopener noreferrer"
          class="badge-link"
        >
          <svg class="w-4 h-4 text-primary shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2L9.5 8.5L3 9.5L7.5 14L6.5 20.5L12 17.5L17.5 20.5L16.5 14L21 9.5L14.5 8.5L12 2Z" />
          </svg>
          <span>Former Microsoft MVP</span>
        </a>

        <a
          href="https://stars.github.com/alumni/"
          target="_blank"
          rel="nofollow noopener noreferrer"
          class="badge-link"
        >
          <svg class="w-4 h-4 text-primary shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2L9.5 8.5L3 9.5L7.5 14L6.5 20.5L12 17.5L17.5 20.5L16.5 14L21 9.5L14.5 8.5L12 2Z" />
          </svg>
          <span>GitHub Star Alumni</span>
        </a>

        <a
          href="https://nuxtjs.org/teams/"
          target="_blank"
          rel="nofollow noopener noreferrer"
          class="badge-link"
        >
          <svg class="w-4 h-4 text-primary shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2L9.5 8.5L3 9.5L7.5 14L6.5 20.5L12 17.5L17.5 20.5L16.5 14L21 9.5L14.5 8.5L12 2Z" />
          </svg>
          <span>Nuxt Ambassador</span>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-atmosphere {
  background-color: #091a28;
}

.hero-glow {
  position: absolute;
  inset: 0;
}

.hero-glow-main {
  background: radial-gradient(
    ellipse 70% 55% at 50% 35%,
    rgba(216, 0, 45, 0.22),
    transparent 68%
  );
  animation: hero-breathe 8s ease-in-out infinite;
}

.hero-glow-soft {
  background: radial-gradient(
    ellipse 90% 70% at 50% 100%,
    rgba(216, 0, 45, 0.08),
    transparent 55%
  );
}

.hero-grid-lines {
  position: absolute;
  inset: 0;
  opacity: 0.07;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.55) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.55) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(ellipse 65% 55% at 50% 40%, black, transparent 75%);
}

.hero-rule {
  width: 3.5rem;
  height: 3px;
  border-radius: 9999px;
  background: linear-gradient(90deg, transparent, #d8002d, transparent);
}

.badge-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.9rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #d1d5db;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 9999px;
  background: rgba(9, 26, 40, 0.45);
  backdrop-filter: blur(6px);
  transition: color 0.2s ease, border-color 0.2s ease, background-color 0.2s ease;
}

.badge-link:hover {
  color: #fff;
  border-color: #d8002d;
  background: rgba(216, 0, 45, 0.12);
}

.hero-animate {
  animation: hero-rise 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.hero-animate-1 { animation-delay: 0.08s; }
.hero-animate-2 { animation-delay: 0.24s; }
.hero-animate-3 { animation-delay: 0.4s; }

@keyframes hero-rise {
  from {
    opacity: 0;
    transform: translateY(1rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes hero-breathe {
  0%, 100% { opacity: 0.85; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.04); }
}

@media (prefers-reduced-motion: reduce) {
  .hero-animate,
  .hero-glow-main {
    animation: none;
  }
}
</style>
