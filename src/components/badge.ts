import { attachHoverProgress } from '../hover-progress.js'
import { DNCClickError } from '../errors.js'

export interface BadgeOptions {
  count?: number
  dot?: boolean
  type?: 'default' | 'success' | 'warning' | 'error'
  onInteract?: () => void
  duration?: number
}

export function createBadge(options: BadgeOptions): HTMLElement {
  const { count, dot = false, type = 'default', onInteract, duration } = options

  const badge = document.createElement('span')
  badge.className = `dnc-badge dnc-badge--${type}`
  badge.setAttribute('role', onInteract ? 'button' : 'status')
  if (onInteract) {
    badge.setAttribute('aria-label', count !== undefined ? `Badge: ${count}` : 'Badge')
  }

  if (dot) {
    badge.classList.add('dnc-badge--dot')
  } else if (count !== undefined) {
    const text = document.createElement('span')
    text.className = 'dnc-badge-text'
    text.textContent = count > 99 ? '99+' : String(count)
    badge.appendChild(text)
  }

  if (onInteract) {
    const fill = document.createElement('span')
    fill.className = 'dnc-badge-fill'
    fill.setAttribute('aria-hidden', 'true')
    badge.insertBefore(fill, badge.firstChild)

    attachHoverProgress(badge, {
      duration,
      onInteract,
      elementType: 'badge',
    })
  }

  badge.addEventListener('click', (e) => {
    e.preventDefault()
    e.stopPropagation()
    throw new DNCClickError('badge')
  })

  return badge
}
