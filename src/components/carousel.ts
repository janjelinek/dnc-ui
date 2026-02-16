import { attachHoverProgress } from '../hover-progress.js'
import { DNCClickError } from '../errors.js'
import { getDefaultDuration } from '../config.js'

export interface CarouselOptions {
  slides: (HTMLElement | string)[]
  activeIndex?: number
  onInteract: (index: number) => void
  duration?: number
  showArrows?: boolean
  showDots?: boolean
  /** Velocity threshold in px/ms. Default 0.35 */
  swipeThreshold?: number
  /** Min distance in px for swipe. Default 60 */
  swipeMinDistance?: number
}

interface SwipeSample {
  x: number
  t: number
}

const SWIPE_SAMPLE_MAX = 15
const SWIPE_COOLDOWN_MS = 400

export function createCarousel(options: CarouselOptions): HTMLElement {
  const {
    slides: slideItems,
    activeIndex: initialIndex = 0,
    onInteract,
    duration,
    showArrows = true,
    showDots = true,
    swipeThreshold = 0.35,
    swipeMinDistance = 60,
  } = options

  const count = slideItems.length
  let activeIndex = Math.max(0, Math.min(initialIndex, count - 1))

  const carousel = document.createElement('div')
  carousel.className = 'dnc-carousel'
  carousel.setAttribute('role', 'region')
  carousel.setAttribute('aria-label', 'Carousel')

  const viewport = document.createElement('div')
  viewport.className = 'dnc-carousel-viewport'

  const track = document.createElement('div')
  track.className = 'dnc-carousel-track'

  slideItems.forEach((item, i) => {
    const slide = document.createElement('div')
    slide.className = 'dnc-carousel-slide'
    slide.setAttribute('data-index', String(i))
    if (i === activeIndex) {
      slide.setAttribute('aria-current', 'true')
    }
    if (typeof item === 'string') {
      slide.innerHTML = item
    } else {
      slide.appendChild(item.cloneNode(true))
    }
    track.appendChild(slide)
  })

  viewport.appendChild(track)
  carousel.appendChild(viewport)

  function goTo(index: number): void {
    if (index < 0 || index >= count) return
    activeIndex = index
    track.style.setProperty('--dnc-carousel-index', String(index))
    track.querySelectorAll('.dnc-carousel-slide').forEach((el, i) => {
      const slide = el as HTMLElement
      if (i === index) {
        slide.setAttribute('aria-current', 'true')
      } else {
        slide.removeAttribute('aria-current')
      }
    })
    onInteract(index)
    renderDots()
  }

  function goPrev(): void {
    goTo(activeIndex > 0 ? activeIndex - 1 : count - 1)
  }

  function goNext(): void {
    goTo(activeIndex < count - 1 ? activeIndex + 1 : 0)
  }

  track.style.setProperty('--dnc-carousel-index', String(activeIndex))

  // --- Swipe gesture ---
  const swipeSamples: SwipeSample[] = []
  let lastSwipeTime = 0

  function onSwipeMove(e: MouseEvent): void {
    const now = performance.now()
    swipeSamples.push({ x: e.clientX, t: now })
    if (swipeSamples.length > SWIPE_SAMPLE_MAX) {
      swipeSamples.shift()
    }
    if (swipeSamples.length < 3) return
    if (now - lastSwipeTime < SWIPE_COOLDOWN_MS) return

    const first = swipeSamples[0]
    const last = swipeSamples[swipeSamples.length - 1]
    const deltaX = last.x - first.x
    const deltaT = last.t - first.t
    if (deltaT < 20) return
    const velocity = deltaX / deltaT

    if (deltaX < -swipeMinDistance && velocity < -swipeThreshold) {
      lastSwipeTime = now
      swipeSamples.length = 0
      goNext()
    } else if (deltaX > swipeMinDistance && velocity > swipeThreshold) {
      lastSwipeTime = now
      swipeSamples.length = 0
      goPrev()
    }
  }

  viewport.addEventListener('mousemove', onSwipeMove)
  viewport.addEventListener('mouseleave', () => {
    swipeSamples.length = 0
  })

  // --- Arrow zones ---
  if (showArrows && count > 1) {
    const prevZone = document.createElement('div')
    prevZone.className = 'dnc-carousel-prev'
    prevZone.setAttribute('aria-label', 'Previous slide')
    const prevFill = document.createElement('span')
    prevFill.className = 'dnc-carousel-zone-fill'
    prevFill.setAttribute('aria-hidden', 'true')
    const prevArrow = document.createElement('span')
    prevArrow.className = 'dnc-carousel-arrow'
    prevArrow.textContent = '‹'
    prevZone.appendChild(prevFill)
    prevZone.appendChild(prevArrow)

    attachHoverProgress(prevZone, {
      duration: duration ?? getDefaultDuration(),
      onInteract: goPrev,
      elementType: 'carousel',
    })
    carousel.appendChild(prevZone)

    const nextZone = document.createElement('div')
    nextZone.className = 'dnc-carousel-next'
    nextZone.setAttribute('aria-label', 'Next slide')
    const nextFill = document.createElement('span')
    nextFill.className = 'dnc-carousel-zone-fill'
    nextFill.setAttribute('aria-hidden', 'true')
    const nextArrow = document.createElement('span')
    nextArrow.className = 'dnc-carousel-arrow'
    nextArrow.textContent = '›'
    nextZone.appendChild(nextFill)
    nextZone.appendChild(nextArrow)

    attachHoverProgress(nextZone, {
      duration: duration ?? getDefaultDuration(),
      onInteract: goNext,
      elementType: 'carousel',
    })
    carousel.appendChild(nextZone)
  }

  // --- Dots ---
  let dotsContainer: HTMLElement | null = null

  function renderDots(): void {
    if (!showDots || count <= 1) return
    if (!dotsContainer) {
      dotsContainer = document.createElement('div')
      dotsContainer.className = 'dnc-carousel-dots'
      dotsContainer.setAttribute('aria-label', 'Slide indicators')
      carousel.appendChild(dotsContainer)
    }
    dotsContainer.innerHTML = ''
    for (let i = 0; i < count; i++) {
      const dot = document.createElement('span')
      dot.className = 'dnc-carousel-dot'
      if (i === activeIndex) dot.classList.add('dnc-carousel-dot--active')
      dot.setAttribute('data-index', String(i))
      dot.setAttribute('aria-label', `Slide ${i + 1}`)
      const dotFill = document.createElement('span')
      dotFill.className = 'dnc-carousel-dot-fill'
      dotFill.setAttribute('aria-hidden', 'true')
      dot.appendChild(dotFill)
      if (i !== activeIndex) {
        attachHoverProgress(dot, {
          duration: duration ?? getDefaultDuration(),
          onInteract: () => goTo(i),
          elementType: 'carousel',
        })
      }
      dotsContainer.appendChild(dot)
    }
  }

  if (showDots && count > 1) {
    renderDots()
  }

  // --- Click block ---
  carousel.addEventListener('click', (e) => {
    e.preventDefault()
    e.stopPropagation()
    throw new DNCClickError('carousel')
  })

  return carousel
}
