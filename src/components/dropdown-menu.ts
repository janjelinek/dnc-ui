import { attachHoverProgress } from '../hover-progress.js'
import { DNCClickError } from '../errors.js'

export interface DropdownMenuItem {
  id?: string
  label?: string
  type?: 'divider'
  icon?: string
  danger?: boolean
  children?: DropdownMenuItem[]
}

export interface DropdownMenuOptions {
  trigger: HTMLElement | string
  items: DropdownMenuItem[]
  onInteract: (itemId: string) => void
  duration?: number
  position?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'
}

const OPEN_DELAY_MS = 300

export function createDropdownMenu(options: DropdownMenuOptions): HTMLElement {
  const {
    trigger,
    items,
    onInteract,
    duration,
    position = 'bottom-start',
  } = options

  const container = document.createElement('div')
  container.className = 'dnc-dropdown-menu'

  let triggerEl: HTMLElement
  if (typeof trigger === 'string') {
    const btn = document.createElement('button')
    btn.type = 'button'
    btn.className = 'dnc-dropdown-menu-trigger'
    btn.textContent = trigger
    triggerEl = btn
  } else {
    triggerEl = trigger
  }

  const dropdown = document.createElement('div')
  dropdown.className = `dnc-dropdown-menu-panel dnc-dropdown-menu--${position}`
  dropdown.setAttribute('role', 'menu')
  dropdown.hidden = true

  let openTimeout: number

  items.forEach((item) => {
    if (item.type === 'divider') {
      const div = document.createElement('div')
      div.className = 'dnc-dropdown-menu-divider'
      div.setAttribute('role', 'separator')
      dropdown.appendChild(div)
      return
    }

    if (!item.id) return

    const itemEl = document.createElement('div')
    itemEl.className = 'dnc-dropdown-menu-item'
    itemEl.setAttribute('role', 'menuitem')
    itemEl.setAttribute('data-id', item.id)
    if (item.danger) itemEl.classList.add('dnc-dropdown-menu-item--danger')

    const fill = document.createElement('span')
    fill.className = 'dnc-dropdown-menu-item-fill'
    fill.setAttribute('aria-hidden', 'true')

    if (item.icon) {
      const icon = document.createElement('span')
      icon.className = 'dnc-dropdown-menu-item-icon'
      icon.textContent = item.icon
      itemEl.appendChild(icon)
    }

    const text = document.createElement('span')
    text.className = 'dnc-dropdown-menu-item-text'
    text.textContent = item.label ?? ''
    itemEl.appendChild(fill)
    itemEl.appendChild(text)

    attachHoverProgress(itemEl, {
      duration,
      onInteract: () => {
        dropdown.hidden = true
        onInteract(item.id!)
      },
      elementType: 'dropdown-menu',
    })

    dropdown.appendChild(itemEl)
  })

  triggerEl.addEventListener('mouseenter', () => {
    openTimeout = window.setTimeout(() => {
      dropdown.hidden = false
    }, OPEN_DELAY_MS)
  })

  container.addEventListener('mouseleave', () => {
    clearTimeout(openTimeout)
    dropdown.hidden = true
  })

  triggerEl.addEventListener('click', (e) => {
    e.preventDefault()
    e.stopPropagation()
    throw new DNCClickError('dropdown-menu')
  })
  dropdown.addEventListener('click', (e) => {
    e.preventDefault()
    e.stopPropagation()
    throw new DNCClickError('dropdown-menu')
  })

  container.appendChild(triggerEl)
  container.appendChild(dropdown)

  return container
}
