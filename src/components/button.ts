import { attachHoverProgress } from '../hover-progress.js'

export interface ButtonOptions {
  label: string
  onInteract: () => void
  duration?: number
}

export function createButton(options: ButtonOptions): HTMLElement {
  const { label, onInteract, duration } = options

  const btn = document.createElement('button')
  btn.type = 'button'
  btn.className = 'dnc-button'
  btn.setAttribute('aria-label', label)

  const fill = document.createElement('span')
  fill.className = 'dnc-button-fill'
  fill.setAttribute('aria-hidden', 'true')

  const text = document.createElement('span')
  text.className = 'dnc-button-text'
  text.textContent = label

  btn.appendChild(fill)
  btn.appendChild(text)

  attachHoverProgress(btn, {
    duration,
    onInteract,
    elementType: 'button',
  })

  return btn
}
