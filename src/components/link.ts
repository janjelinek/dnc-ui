import { attachHoverProgress } from '../hover-progress.js'

export interface LinkOptions {
  label: string
  href?: string
  onInteract: () => void
  duration?: number
}

export function createLink(options: LinkOptions): HTMLElement {
  const { label, href, onInteract, duration } = options

  const a = document.createElement('a')
  a.className = 'dnc-link'
  a.href = href ?? '#'
  a.setAttribute('role', 'link')

  const text = document.createElement('span')
  text.className = 'dnc-link-text'
  text.textContent = label

  const underline = document.createElement('span')
  underline.className = 'dnc-link-underline'
  underline.setAttribute('aria-hidden', 'true')

  a.appendChild(text)
  a.appendChild(underline)

  attachHoverProgress(a, {
    duration,
    onInteract,
    elementType: 'link',
  })

  return a
}
