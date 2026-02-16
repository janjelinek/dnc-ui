import { attachHoverProgress } from '../hover-progress.js'
import { DNCClickError } from '../errors.js'

export interface IconButtonOptions {
  icon: string
  ariaLabel: string
  onInteract: () => void
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'ghost' | 'danger'
  duration?: number
}

export function createIconButton(options: IconButtonOptions): HTMLElement {
  const {
    icon,
    ariaLabel,
    onInteract,
    size = 'md',
    variant = 'default',
    duration,
  } = options

  const btn = document.createElement('button')
  btn.type = 'button'
  btn.className = `dnc-icon-button dnc-icon-button--${size} dnc-icon-button--${variant}`
  btn.setAttribute('aria-label', ariaLabel)

  const fill = document.createElement('span')
  fill.className = 'dnc-icon-button-fill'
  fill.setAttribute('aria-hidden', 'true')

  const iconEl = document.createElement('span')
  iconEl.className = 'dnc-icon-button-icon'
  iconEl.textContent = icon

  btn.appendChild(fill)
  btn.appendChild(iconEl)

  attachHoverProgress(btn, {
    duration,
    onInteract,
    elementType: 'icon-button',
  })

  btn.addEventListener('click', (e) => {
    e.preventDefault()
    e.stopPropagation()
    throw new DNCClickError('icon-button')
  })

  return btn
}
