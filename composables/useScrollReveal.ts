/**
 * Fade-up scroll reveal for elements with `.animated-section`.
 * Styles live in `assets/css/main.css`.
 */
export function useScrollReveal(root?: Ref<HTMLElement | null | undefined>) {
  let observer: IntersectionObserver | null = null

  const resolveScope = (): ParentNode => root?.value ?? document

  const observe = () => {
    if (!import.meta.client || !observer)
      return

    resolveScope().querySelectorAll('.animated-section:not(.fade-in)').forEach((el) => {
      observer?.observe(el)
    })
  }

  onMounted(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      resolveScope().querySelectorAll('.animated-section').forEach((el) => {
        el.classList.add('fade-in')
      })
      return
    }

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in')
            observer?.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
    )

    nextTick(observe)
  })

  onUpdated(() => {
    nextTick(observe)
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
    observer = null
  })
}
