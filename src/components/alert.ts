import { attachHoverProgress } from '../hover-progress.js'
import { DNCClickError } from '../errors.js'

export interface AlertOptions {
  message: string
  type?: 'info' | 'success' | 'warning' | 'error'
  dismissible?: boolean
  onDismiss?: () => void
  duration?: number
}

const TYPE_ICONS: Record<string, string> = {
  info: 'ℹ',
  success: '✓',
  warning: '⚠',
  error: '✕',
}

export function createAlert(options: AlertOptions): HTMLElement {
  const {
    message,
    type = 'info',
    dismissible = true,
    onDismiss,
    duration,
  } = options

  const alert = document.createElement('div')
  alert.className = `dnc-alert dnc-alert--${type}`
  alert.setAttribute('role', 'alert')

  const content = document.createElement('div')
  content.className = 'dnc-alert-content'
  const icon = document.createElement('span')
  icon.className = 'dnc-alert-icon'
  icon.textContent = TYPE_ICONS[type] ?? TYPE_ICONS.info
  icon.setAttribute('aria-hidden', 'true')
  const text = document.createElement('span')
  text.className = 'dnc-alert-message'
  text.textContent = message
  content.appendChild(icon)
  content.appendChild(text)
  alert.appendChild(content)

  if (dismissible && onDismiss) {
    const dismissBtn = document.createElement('button')
    dismissBtn.type = 'button'
    dismissBtn.className = 'dnc-alert-dismiss'
    dismissBtn.setAttribute('aria-label', 'Dismiss')

    const fill = document.createElement('span')
    fill.className = 'dnc-alert-dismiss-fill'
    fill.setAttribute('aria-hidden', 'true')
    const iconEl = document.createElement('span')
    iconEl.className = 'dnc-alert-dismiss-icon'
    iconEl.textContent = '×'

    dismissBtn.appendChild(fill)
    dismissBtn.appendChild(iconEl)

    attachHoverProgress(dismissBtn, {
      duration,
      onInteract: () => {
        onDismiss()
        alert.remove()
      },
      elementType: 'alert',
    })

    dismissBtn.addEventListener('click', (e) => {
      e.preventDefault()
      e.stopPropagation()
      throw new DNCClickError('alert')
    })

    alert.appendChild(dismissBtn)
  } else {
    alert.addEventListener('click', (e) => {
      e.preventDefault()
      e.stopPropagation()
      throw new DNCClickError('alert')
    })
  }

  return alert
}
