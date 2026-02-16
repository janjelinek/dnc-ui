import { DNCClickError } from './errors.js'
import { getDefaultDuration } from './config.js'

export interface HoverProgressOptions {
  duration?: number
  onInteract: () => void
  elementType: string
  /** When true, keeps cycling: after onInteract fires, restarts progress while still hovering */
  repeat?: boolean
}

export function attachHoverProgress(
  element: HTMLElement,
  options: HoverProgressOptions
): void {
  const { onInteract, elementType, repeat = false } = options

  let rafId: number
  let startTime: number | null = null

  function startProgress(): void {
    const durationMs = options.duration ?? getDefaultDuration()
    startTime = performance.now()
    const tick = (now: number) => {
      const elapsed = now - (startTime ?? 0)
      const progress = Math.min(elapsed / durationMs, 1)
      element.style.setProperty('--dnc-progress', String(progress))
      if (progress < 1) {
        rafId = requestAnimationFrame(tick)
      } else {
        onInteract()
        if (repeat && startTime !== null) {
          startProgress()
        }
      }
    }
    rafId = requestAnimationFrame(tick)
  }

  element.addEventListener('mouseenter', () => {
    startProgress()
  })

  element.addEventListener('mouseleave', () => {
    cancelAnimationFrame(rafId)
    startTime = null
    element.style.setProperty('--dnc-progress', '0')
  })

  element.addEventListener('click', (e) => {
    e.preventDefault()
    e.stopPropagation()
    throw new DNCClickError(elementType)
  })
}
