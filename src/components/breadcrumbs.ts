import { attachHoverProgress } from '../hover-progress.js'

export interface BreadcrumbItem {
  id: string
  label: string
}

export interface BreadcrumbsOptions {
  items: BreadcrumbItem[]
  onInteract: (itemId: string) => void
  separator?: string
  duration?: number
}

export function createBreadcrumbs(options: BreadcrumbsOptions): HTMLElement {
  const { items, onInteract, separator = '/', duration } = options

  const nav = document.createElement('nav')
  nav.className = 'dnc-breadcrumbs'
  nav.setAttribute('aria-label', 'Breadcrumb')

  items.forEach((item, index) => {
    if (index > 0) {
      const sep = document.createElement('span')
      sep.className = 'dnc-breadcrumbs-separator'
      sep.textContent = separator
      sep.setAttribute('aria-hidden', 'true')
      nav.appendChild(sep)
    }

    const isLast = index === items.length - 1

    if (isLast) {
      const span = document.createElement('span')
      span.className = 'dnc-breadcrumbs-current'
      span.textContent = item.label
      span.setAttribute('aria-current', 'page')
      nav.appendChild(span)
    } else {
      const crumb = document.createElement('span')
      crumb.className = 'dnc-breadcrumbs-crumb'
      crumb.setAttribute('role', 'button')
      crumb.setAttribute('data-id', item.id)

      const fill = document.createElement('span')
      fill.className = 'dnc-breadcrumbs-crumb-fill'
      fill.setAttribute('aria-hidden', 'true')

      const text = document.createElement('span')
      text.className = 'dnc-breadcrumbs-crumb-text'
      text.textContent = item.label

      crumb.appendChild(fill)
      crumb.appendChild(text)

      attachHoverProgress(crumb, {
        duration,
        onInteract: () => onInteract(item.id),
        elementType: 'breadcrumb',
      })

      nav.appendChild(crumb)
    }
  })

  return nav
}
