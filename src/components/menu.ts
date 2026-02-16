import { attachHoverProgress } from '../hover-progress.js'
import { DNCClickError } from '../errors.js'

export interface MenuItem {
  id: string
  label: string
  children?: MenuItem[]
}

export interface MenuOptions {
  items: MenuItem[]
  activeId?: string
  onInteract: (itemId: string) => void
  duration?: number
}

const OPEN_DELAY_MS = 300

export function createMenu(options: MenuOptions): HTMLElement {
  const { items, activeId, onInteract, duration } = options

  const nav = document.createElement('nav')
  nav.className = 'dnc-menu'
  nav.setAttribute('role', 'menubar')

  let openTimeout: number

  items.forEach((item) => {
    const wrapper = document.createElement('div')
    wrapper.className = 'dnc-menu-item-wrapper'
    if (item.children?.length) {
      wrapper.classList.add('dnc-menu-has-children')
    }

    const itemEl = document.createElement('div')
    itemEl.className = 'dnc-menu-item'
    itemEl.setAttribute('role', 'menuitem')
    itemEl.setAttribute('data-id', item.id)
    if (item.id === activeId) {
      itemEl.classList.add('dnc-menu-item--active')
    }
    if (item.children?.length) {
      itemEl.setAttribute('aria-haspopup', 'true')
    }

    const fill = document.createElement('span')
    fill.className = 'dnc-menu-item-fill'
    fill.setAttribute('aria-hidden', 'true')

    const text = document.createElement('span')
    text.className = 'dnc-menu-item-text'
    text.textContent = item.label

    itemEl.appendChild(fill)
    itemEl.appendChild(text)

    if (item.children?.length) {
      const chevron = document.createElement('span')
      chevron.className = 'dnc-menu-chevron'
      chevron.setAttribute('aria-hidden', 'true')
      chevron.textContent = '▾'
      itemEl.appendChild(chevron)

      const submenu = document.createElement('div')
      submenu.className = 'dnc-menu-submenu'
      submenu.setAttribute('role', 'menu')
      submenu.hidden = true

      item.children.forEach((child) => {
        const subItem = document.createElement('div')
        subItem.className = 'dnc-menu-submenu-item'
        subItem.setAttribute('role', 'menuitem')
        subItem.setAttribute('data-id', child.id)

        const subFill = document.createElement('span')
        subFill.className = 'dnc-menu-item-fill'
        subFill.setAttribute('aria-hidden', 'true')

        const subText = document.createElement('span')
        subText.className = 'dnc-menu-item-text'
        subText.textContent = child.label

        subItem.appendChild(subFill)
        subItem.appendChild(subText)

        attachHoverProgress(subItem, {
          duration,
          onInteract: () => {
            submenu.hidden = true
            onInteract(child.id)
          },
          elementType: 'menu',
        })

        submenu.appendChild(subItem)
      })

      wrapper.addEventListener('mouseenter', () => {
        clearTimeout(openTimeout)
        openTimeout = window.setTimeout(() => {
          submenu.hidden = false
        }, OPEN_DELAY_MS)
      })

      wrapper.addEventListener('mouseleave', () => {
        clearTimeout(openTimeout)
        submenu.hidden = true
      })

      itemEl.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopPropagation()
        throw new DNCClickError('menu')
      })
      wrapper.appendChild(itemEl)
      wrapper.appendChild(submenu)
    } else {
      attachHoverProgress(itemEl, {
        duration,
        onInteract: () => onInteract(item.id),
        elementType: 'menu',
      })
      wrapper.appendChild(itemEl)
    }

    nav.appendChild(wrapper)
  })

  nav.addEventListener('mouseleave', () => {
    clearTimeout(openTimeout)
    nav.querySelectorAll('.dnc-menu-submenu').forEach((sub) => {
      ;(sub as HTMLElement).hidden = true
    })
  })

  return nav
}
