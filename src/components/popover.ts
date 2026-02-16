import { attachHoverProgress } from '../hover-progress.js'
import { DNCClickError } from '../errors.js'

export interface PopoverOptions {
  trigger: HTMLElement
  content: HTMLElement | string
  position?: 'top' | 'bottom' | 'left' | 'right'
  duration?: number
}

const HIDE_DELAY_MS = 100

export function createPopover(options: PopoverOptions): HTMLElement {
  const { trigger, content, position = 'bottom', duration } = options

  const popover = document.createElement('div')
  popover.className = `dnc-popover dnc-popover--${position}`
  popover.setAttribute('role', 'dialog')
  popover.hidden = true

  if (typeof content === 'string') {
    popover.textContent = content
  } else {
    popover.appendChild(content)
  }

  const wrapper = document.createElement('div')
  wrapper.className = 'dnc-popover-wrapper'
  wrapper.style.position = 'relative'
  wrapper.style.display = 'inline-block'

  const parent = trigger.parentNode
  if (parent) {
    parent.insertBefore(wrapper, trigger)
  }
  wrapper.appendChild(trigger)

  let hideTimeout: number

  const positionPopover = () => {
    const rect = trigger.getBoundingClientRect()
    popover.style.position = 'fixed'
    popover.style.transform = ''
    if (position === 'bottom') {
      popover.style.left = `${rect.left + rect.width / 2}px`
      popover.style.top = `${rect.bottom}px`
      popover.style.transform = 'translateX(-50%)'
    } else if (position === 'top') {
      popover.style.left = `${rect.left + rect.width / 2}px`
      popover.style.bottom = `${window.innerHeight - rect.top}px`
      popover.style.transform = 'translateX(-50%)'
    } else if (position === 'left') {
      popover.style.right = `${window.innerWidth - rect.left}px`
      popover.style.top = `${rect.top + rect.height / 2}px`
      popover.style.transform = 'translateY(-50%)'
    } else {
      popover.style.left = `${rect.right}px`
      popover.style.top = `${rect.top + rect.height / 2}px`
      popover.style.transform = 'translateY(-50%)'
    }
  }

  const show = () => {
    positionPopover()
    document.body.appendChild(popover)
    popover.hidden = false
  }

  const hide = () => {
    popover.hidden = true
    if (popover.parentNode) popover.remove()
  }

  const scheduleHide = () => {
    hideTimeout = window.setTimeout(hide, HIDE_DELAY_MS)
  }

  const cancelHide = () => {
    clearTimeout(hideTimeout)
  }

  attachHoverProgress(trigger, {
    duration,
    onInteract: show,
    elementType: 'popover',
  })

  trigger.addEventListener('mouseleave', (e) => {
    const to = e.relatedTarget as Node | null
    if (to && popover.contains(to)) return
    scheduleHide()
  })

  popover.addEventListener('mouseenter', cancelHide)
  popover.addEventListener('mouseleave', (e) => {
    const to = e.relatedTarget as Node | null
    if (to && (trigger.contains(to) || wrapper.contains(to))) return
    scheduleHide()
  })

  trigger.addEventListener('click', (e) => {
    e.preventDefault()
    e.stopPropagation()
    throw new DNCClickError('popover')
  })
  popover.addEventListener('click', (e) => {
    e.preventDefault()
    e.stopPropagation()
    throw new DNCClickError('popover')
  })

  trigger.addEventListener('mouseenter', cancelHide)

  return wrapper
}
