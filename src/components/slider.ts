import { attachHoverProgress } from '../hover-progress.js'
import { DNCClickError } from '../errors.js'

export interface SliderOptions {
  min?: number
  max?: number
  value?: number
  onInteract: (value: number) => void
  duration?: number
}

export function createSlider(options: SliderOptions): HTMLElement {
  const min = options.min ?? 0
  const max = options.max ?? 100
  const initialValue = options.value ?? min
  const { onInteract, duration } = options

  const container = document.createElement('div')
  container.className = 'dnc-slider'

  const track = document.createElement('div')
  track.className = 'dnc-slider-track'

  const fill = document.createElement('div')
  fill.className = 'dnc-slider-fill'

  const thumb = document.createElement('div')
  thumb.className = 'dnc-slider-thumb'

  const hoverDot = document.createElement('div')
  hoverDot.className = 'dnc-slider-hover-dot'
  hoverDot.setAttribute('aria-hidden', 'true')

  const valueLabel = document.createElement('span')
  valueLabel.className = 'dnc-slider-value'
  valueLabel.textContent = String(initialValue)

  let currentValue = initialValue
  let lastMouseX = 0

  function setValue(v: number) {
    currentValue = Math.max(min, Math.min(max, v))
    const pct = ((currentValue - min) / (max - min)) * 100
    track.style.setProperty('--dnc-slider-value', String(pct))
    valueLabel.textContent = String(Math.round(currentValue))
  }

  setValue(initialValue)

  track.addEventListener('mousemove', (e) => {
    const rect = track.getBoundingClientRect()
    lastMouseX = e.clientX - rect.left
    track.style.setProperty('--dnc-slider-hover-x', `${lastMouseX}px`)
  })

  track.addEventListener('mouseenter', (e) => {
    const rect = track.getBoundingClientRect()
    lastMouseX = e.clientX - rect.left
    track.style.setProperty('--dnc-slider-hover-x', `${lastMouseX}px`)
  })

  track.addEventListener('mouseleave', () => {
    track.style.removeProperty('--dnc-slider-hover-x')
  })

  attachHoverProgress(track, {
    duration,
    onInteract: () => {
      const rect = track.getBoundingClientRect()
      const pct = Math.max(0, Math.min(100, (lastMouseX / rect.width) * 100))
      const targetValue = min + (pct / 100) * (max - min)
      setValue(targetValue)
      onInteract(currentValue)
    },
    elementType: 'slider',
  })

  track.addEventListener('click', (e) => {
    e.preventDefault()
    e.stopPropagation()
    throw new DNCClickError('slider')
  })

  track.appendChild(fill)
  track.appendChild(thumb)
  track.appendChild(hoverDot)
  container.appendChild(track)
  container.appendChild(valueLabel)

  return container
}
