import { DNCClickError } from '../errors.js'

export interface TooltipOptions {
  target: HTMLElement
  content: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
}

const DEFAULT_DELAY_MS = 200

export function createTooltip(options: TooltipOptions): HTMLElement {
  const { target, content, position = 'top', delay = DEFAULT_DELAY_MS } = options

  const tooltip = document.createElement('div')
  tooltip.className = `dnc-tooltip dnc-tooltip--${position}`
  tooltip.setAttribute('role', 'tooltip')
  tooltip.textContent = content
  tooltip.hidden = true

  const wrapper = document.createElement('div')
  wrapper.className = 'dnc-tooltip-wrapper'
  wrapper.style.position = 'relative'
  wrapper.style.display = 'inline-block'

  const parent = target.parentNode
  if (parent) {
    parent.insertBefore(wrapper, target)
  }
  wrapper.appendChild(target)
  wrapper.appendChild(tooltip)

  let showTimeout: number

  const show = () => {
    showTimeout = window.setTimeout(() => {
      tooltip.hidden = false
    }, delay)
  }

  const hide = () => {
    clearTimeout(showTimeout)
    tooltip.hidden = true
  }

  target.addEventListener('mouseenter', show)
  target.addEventListener('mouseleave', hide)
  target.addEventListener('click', (e) => {
    e.preventDefault()
    e.stopPropagation()
    throw new DNCClickError('tooltip')
  })

  tooltip.id = `dnc-tooltip-${Math.random().toString(36).slice(2)}`
  target.setAttribute('aria-describedby', tooltip.id)

  return wrapper
}
