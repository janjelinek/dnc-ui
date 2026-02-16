import { attachHoverToFocus } from '../hover-to-focus.js'

export interface InputOptions {
  placeholder?: string
  value: string
  type?: 'text' | 'email' | 'password' | 'url' | 'tel'
  onInteract: (value: string) => void
  onActivate?: () => void
  duration?: number
}

export function createInput(options: InputOptions): HTMLElement {
  const {
    placeholder = '',
    value,
    type = 'text',
    onInteract,
    onActivate,
    duration,
  } = options

  const wrapper = document.createElement('div')
  wrapper.className = 'dnc-input-wrapper'

  const input = document.createElement('input')
  input.className = 'dnc-input'
  input.type = type
  input.placeholder = placeholder
  input.value = value
  input.setAttribute('tabindex', '-1')
  input.setAttribute('readonly', '')

  const fill = document.createElement('span')
  fill.className = 'dnc-input-fill'
  fill.setAttribute('aria-hidden', 'true')

  input.addEventListener('input', () => {
    onInteract(input.value)
  })

  attachHoverToFocus(wrapper, input, {
    duration,
    onActivate,
    elementType: 'input',
  })

  wrapper.appendChild(input)
  wrapper.appendChild(fill)

  return wrapper
}
