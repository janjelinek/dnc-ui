import { attachHoverProgress } from '../hover-progress.js'
import { DNCClickError } from '../errors.js'

export interface SelectOption {
  value: string
  label: string
}

export interface SelectOptions {
  options: SelectOption[]
  placeholder?: string
  onInteract: (value: string) => void
  duration?: number
}

export function createSelect(options: SelectOptions): HTMLElement {
  const { options: opts, placeholder = 'Select...', onInteract, duration } = options

  const container = document.createElement('div')
  container.className = 'dnc-select'

  const trigger = document.createElement('button')
  trigger.type = 'button'
  trigger.className = 'dnc-select-trigger'
  trigger.textContent = placeholder
  trigger.setAttribute('aria-haspopup', 'listbox')
  trigger.setAttribute('aria-expanded', 'false')

  const dropdown = document.createElement('div')
  dropdown.className = 'dnc-select-dropdown'
  dropdown.setAttribute('role', 'listbox')
  dropdown.hidden = true

  opts.forEach((opt) => {
    const item = document.createElement('div')
    item.className = 'dnc-select-option'
    item.setAttribute('data-value', opt.value)
    item.setAttribute('role', 'option')

    const fill = document.createElement('span')
    fill.className = 'dnc-select-option-fill'
    fill.setAttribute('aria-hidden', 'true')

    const text = document.createElement('span')
    text.className = 'dnc-select-option-text'
    text.textContent = opt.label

    item.appendChild(fill)
    item.appendChild(text)

    attachHoverProgress(item, {
      duration,
      onInteract: () => {
        trigger.textContent = opt.label
        dropdown.hidden = true
        trigger.setAttribute('aria-expanded', 'false')
        onInteract(opt.value)
      },
      elementType: 'select',
    })

    dropdown.appendChild(item)
  })

  let openTimeout: number
  const OPEN_DELAY_MS = 300

  trigger.addEventListener('mouseenter', () => {
    openTimeout = window.setTimeout(() => {
      dropdown.hidden = false
      trigger.setAttribute('aria-expanded', 'true')
    }, OPEN_DELAY_MS)
  })

  container.addEventListener('mouseleave', () => {
    clearTimeout(openTimeout)
    dropdown.hidden = true
    trigger.setAttribute('aria-expanded', 'false')
  })

  trigger.addEventListener('click', (e) => {
    e.preventDefault()
    e.stopPropagation()
    throw new DNCClickError('select')
  })

  dropdown.addEventListener('click', (e) => {
    e.preventDefault()
    e.stopPropagation()
    throw new DNCClickError('select')
  })

  container.appendChild(trigger)
  container.appendChild(dropdown)

  return container
}
