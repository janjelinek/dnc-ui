import { attachHoverToFocus } from '../hover-to-focus.js'

export interface TextareaOptions {
  placeholder?: string
  value: string
  rows?: number
  onInteract: (value: string) => void
  onActivate?: () => void
  duration?: number
}

export function createTextarea(options: TextareaOptions): HTMLElement {
  const {
    placeholder = '',
    value,
    rows = 3,
    onInteract,
    onActivate,
    duration,
  } = options

  const wrapper = document.createElement('div')
  wrapper.className = 'dnc-input-wrapper dnc-textarea-wrapper'

  const textarea = document.createElement('textarea')
  textarea.className = 'dnc-input dnc-textarea'
  textarea.placeholder = placeholder
  textarea.value = value
  textarea.rows = rows
  textarea.setAttribute('tabindex', '-1')
  textarea.setAttribute('readonly', '')

  const fill = document.createElement('span')
  fill.className = 'dnc-input-fill'
  fill.setAttribute('aria-hidden', 'true')

  textarea.addEventListener('input', () => {
    onInteract(textarea.value)
  })

  attachHoverToFocus(wrapper, textarea, {
    duration,
    onActivate,
    elementType: 'textarea',
  })

  wrapper.appendChild(textarea)
  wrapper.appendChild(fill)

  return wrapper
}
