import { attachHoverProgress } from '../hover-progress.js'
import { DNCClickError } from '../errors.js'

export interface ButtonGroupItem {
  id: string
  label: string
  icon?: string
}

export interface ButtonGroupOptions {
  items: ButtonGroupItem[]
  activeId: string
  onInteract: (itemId: string) => void
  duration?: number
}

export function createButtonGroup(options: ButtonGroupOptions): HTMLElement {
  const { items, activeId, onInteract, duration } = options

  const group = document.createElement('div')
  group.className = 'dnc-button-group'
  group.setAttribute('role', 'group')

  items.forEach((item, index) => {
    const btn = document.createElement('button')
    btn.type = 'button'
    btn.className = 'dnc-button-group-item'
    if (item.id === activeId) btn.classList.add('dnc-button-group-item--active')
    btn.setAttribute('data-id', item.id)
    btn.setAttribute('aria-pressed', item.id === activeId ? 'true' : 'false')

    const fill = document.createElement('span')
    fill.className = 'dnc-button-group-item-fill'
    fill.setAttribute('aria-hidden', 'true')
    btn.appendChild(fill)

    if (item.icon) {
      const iconEl = document.createElement('span')
      iconEl.className = 'dnc-button-group-item-icon'
      iconEl.textContent = item.icon
      btn.appendChild(iconEl)
    }

    const text = document.createElement('span')
    text.className = 'dnc-button-group-item-text'
    text.textContent = item.label
    btn.appendChild(text)

    if (item.id !== activeId) {
      attachHoverProgress(btn, {
        duration,
        onInteract: () => onInteract(item.id),
        elementType: 'button-group',
      })
    }

    btn.addEventListener('click', (e) => {
      e.preventDefault()
      e.stopPropagation()
      throw new DNCClickError('button-group')
    })

    group.appendChild(btn)
  })

  return group
}
