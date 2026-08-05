/**
 * Fade-up scroll reveal for elements with `.animated-section`.
 * Content stays visible until client JS opts into the reveal,
 * so SSR / slow hydration never leave sections blank.
 * Styles live in `assets/css/main.css`.
 */
export function useScrollReveal(root?: Ref<HTMLElement | null | undefined>) {
  let observer: IntersectionObserver | null = null

  const resolveScope = (): ParentNode => root?.value ?? document

  const isInView = (el: Element) => {
    const rect = el.getBoundingClientRect()
    const viewHeight = window.innerHeight || document.documentElement.clientHeight
    return rect.top < viewHeight * 0.92 && rect.bottom > 0
  }

  const observe = () => {
    if (!import.meta.client || !observer)
      return

    resolveScope().querySelectorAll('.animated-section:not(.fade-in)').forEach((el) => {
      if (isInView(el)) {
        el.classList.add('fade-in')
        el.classList.remove('reveal-pending')
        return
      }

      el.classList.add('reveal-pending')
      observer?.observe(el)
    })
  }

  onMounted(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      resolveScope().querySelectorAll('.animated-section').forEach((el) => {
        el.classList.add('fade-in')
        el.classList.remove('reveal-pending')
      })
      return
    }

    // threshold: 0 — large sections (e.g. full video grids) never reach 0.1
    // intersection ratio while only a slice of them is on screen.
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in')
            entry.target.classList.remove('reveal-pending')
            observer?.unobserve(entry.target)
          }
        })
      },
      { threshold: 0, rootMargin: '0px 0px -8% 0px' },
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
