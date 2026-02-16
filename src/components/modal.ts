import { attachHoverProgress } from '../hover-progress.js'
import { DNCClickError } from '../errors.js'

export interface ModalOptions {
  title: string
  content: HTMLElement | string
  onClose: () => void
  closeOnBackdrop?: boolean
  duration?: number
}

export interface ModalController {
  element: HTMLElement
  open: () => void
  close: () => void
}

export function createModal(options: ModalOptions): ModalController {
  const {
    title,
    content,
    onClose,
    closeOnBackdrop = true,
    duration,
  } = options

  const overlay = document.createElement('div')
  overlay.className = 'dnc-modal-overlay'
  overlay.setAttribute('aria-hidden', 'true')
  overlay.hidden = true

  const modal = document.createElement('div')
  modal.className = 'dnc-modal'
  modal.setAttribute('role', 'dialog')
  modal.setAttribute('aria-modal', 'true')
  modal.setAttribute('aria-labelledby', 'dnc-modal-title')

  const header = document.createElement('div')
  header.className = 'dnc-modal-header'
  const titleEl = document.createElement('h2')
  titleEl.id = 'dnc-modal-title'
  titleEl.className = 'dnc-modal-title'
  titleEl.textContent = title

  const closeBtn = document.createElement('button')
  closeBtn.type = 'button'
  closeBtn.className = 'dnc-modal-close'
  closeBtn.setAttribute('aria-label', 'Close')
  const closeFill = document.createElement('span')
  closeFill.className = 'dnc-modal-close-fill'
  closeFill.setAttribute('aria-hidden', 'true')
  const closeIcon = document.createElement('span')
  closeIcon.className = 'dnc-modal-close-icon'
  closeIcon.textContent = '×'
  closeBtn.appendChild(closeFill)
  closeBtn.appendChild(closeIcon)

  const body = document.createElement('div')
  body.className = 'dnc-modal-body'
  if (typeof content === 'string') {
    body.textContent = content
  } else {
    body.appendChild(content)
  }

  const close = () => {
    overlay.hidden = true
    onClose()
  }

  attachHoverProgress(closeBtn, {
    duration,
    onInteract: close,
    elementType: 'modal',
  })

  closeBtn.addEventListener('click', (e) => {
    e.preventDefault()
    e.stopPropagation()
    throw new DNCClickError('modal')
  })

  const backdrop = document.createElement('div')
  backdrop.className = 'dnc-modal-backdrop'
  if (closeOnBackdrop) {
    attachHoverProgress(backdrop, {
      duration,
      onInteract: close,
      elementType: 'modal',
    })
    backdrop.addEventListener('click', (e) => {
      e.preventDefault()
      e.stopPropagation()
      throw new DNCClickError('modal')
    })
  }

  header.appendChild(titleEl)
  header.appendChild(closeBtn)
  modal.appendChild(header)
  modal.appendChild(body)
  overlay.appendChild(backdrop)
  overlay.appendChild(modal)

  return {
    element: overlay,
    open: () => {
      if (!overlay.parentNode) {
        document.body.appendChild(overlay)
      }
      overlay.hidden = false
    },
    close,
  }
}
