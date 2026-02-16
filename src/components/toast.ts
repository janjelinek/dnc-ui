import { attachHoverProgress } from '../hover-progress.js'
import { DNCClickError } from '../errors.js'

export interface ToasterOptions {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  duration?: number
  hoverDuration?: number
}

export interface ToastShowOptions {
  message: string
  type?: 'info' | 'success' | 'warning' | 'error'
  duration?: number
}

let toasterContainer: HTMLElement | null = null

export function createToaster(options: ToasterOptions = {}): {
  show: (opts: ToastShowOptions) => void
} {
  const {
    position = 'bottom-right',
    duration: autoDismissMs = 5000,
    hoverDuration = 800,
  } = options

  if (!toasterContainer) {
    toasterContainer = document.createElement('div')
    toasterContainer.className = `dnc-toaster dnc-toaster--${position}`
    document.body.appendChild(toasterContainer)
  }

  const show = (opts: ToastShowOptions) => {
    const { message, type = 'info', duration = autoDismissMs } = opts

    const toast = document.createElement('div')
    toast.className = `dnc-toast dnc-toast--${type}`
    toast.setAttribute('role', 'status')

    const fill = document.createElement('span')
    fill.className = 'dnc-toast-fill'
    fill.setAttribute('aria-hidden', 'true')
    const text = document.createElement('span')
    text.className = 'dnc-toast-message'
    text.textContent = message
    toast.appendChild(fill)
    toast.appendChild(text)

    let autoDismissTimeout: number

    const dismiss = () => {
      clearTimeout(autoDismissTimeout)
      toast.classList.add('dnc-toast--exiting')
      setTimeout(() => toast.remove(), 200)
    }

    attachHoverProgress(toast, {
      duration: hoverDuration,
      onInteract: dismiss,
      elementType: 'toast',
    })

    toast.addEventListener('click', (e) => {
      e.preventDefault()
      e.stopPropagation()
      throw new DNCClickError('toast')
    })

    autoDismissTimeout = window.setTimeout(dismiss, duration)

    toasterContainer!.appendChild(toast)
  }

  return { show }
}
