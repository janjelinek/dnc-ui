import { attachHoverProgress } from '../hover-progress.js'
import { DNCClickError } from '../errors.js'

export interface TagOptions {
  label: string
  value?: string
  dismissible?: boolean
  selected?: boolean
  onDismiss?: (value: string) => void
  onInteract?: (selected: boolean) => void
  duration?: number
}

export function createTag(options: TagOptions): HTMLElement {
  const {
    label,
    value,
    dismissible = false,
    selected = false,
    onDismiss,
    onInteract,
    duration,
  } = options

  const tag = document.createElement('span')
  tag.className = 'dnc-tag'
  if (selected) tag.classList.add('dnc-tag--selected')
  if (onInteract) tag.setAttribute('role', 'button')
  tag.setAttribute('data-value', value ?? label)

  const labelEl = document.createElement('span')
  labelEl.className = 'dnc-tag-label'
  labelEl.textContent = label

  const throwOnClick = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    throw new DNCClickError('tag')
  }

  if (dismissible && onDismiss) {
    const dismissBtn = document.createElement('span')
    dismissBtn.className = 'dnc-tag-dismiss'
    dismissBtn.setAttribute('aria-label', 'Remove')
    dismissBtn.textContent = '×'

    const fill = document.createElement('span')
    fill.className = 'dnc-tag-dismiss-fill'
    fill.setAttribute('aria-hidden', 'true')
    dismissBtn.appendChild(fill)

    attachHoverProgress(dismissBtn, {
      duration,
      onInteract: () => onDismiss(value ?? label),
      elementType: 'tag',
    })

    dismissBtn.addEventListener('click', throwOnClick)

    tag.appendChild(labelEl)
    tag.appendChild(dismissBtn)
  } else if (onInteract) {
    const fill = document.createElement('span')
    fill.className = 'dnc-tag-fill'
    fill.setAttribute('aria-hidden', 'true')
    tag.appendChild(fill)
    tag.appendChild(labelEl)

    attachHoverProgress(tag, {
      duration,
      onInteract: () => onInteract(!selected),
      elementType: 'tag',
    })

    tag.addEventListener('click', throwOnClick)
  } else {
    tag.appendChild(labelEl)
    tag.addEventListener('click', throwOnClick)
  }

  return tag
}
