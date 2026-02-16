import { attachHoverToFocus } from '../hover-to-focus.js'
import { attachHoverProgress } from '../hover-progress.js'
import { DNCClickError } from '../errors.js'

export interface NumberInputOptions {
  value: number
  min?: number
  max?: number
  step?: number
  onInteract: (value: number) => void
  duration?: number
}

export function createNumberInput(options: NumberInputOptions): HTMLElement {
  const {
    value: initialValue,
    min = -Infinity,
    max = Infinity,
    step = 1,
    onInteract,
    duration,
  } = options

  const container = document.createElement('div')
  container.className = 'dnc-number-input'

  let currentValue = initialValue

  function setValue(v: number, notify = true): void {
    currentValue = Math.max(min, Math.min(max, v))
    input.value = String(currentValue)
    if (notify) onInteract(currentValue)
  }

  const decrementBtn = document.createElement('span')
  decrementBtn.className = 'dnc-number-decrement'

  const decFill = document.createElement('span')
  decFill.className = 'dnc-number-btn-fill'
  decFill.setAttribute('aria-hidden', 'true')
  const decText = document.createElement('span')
  decText.className = 'dnc-number-btn-text'
  decText.textContent = '−'

  decrementBtn.appendChild(decFill)
  decrementBtn.appendChild(decText)

  const valueWrap = document.createElement('div')
  valueWrap.className = 'dnc-number-value-wrap'

  const input = document.createElement('input')
  input.className = 'dnc-input dnc-number-value'
  input.type = 'text'
  input.inputMode = 'numeric'
  input.value = String(initialValue)
  input.setAttribute('tabindex', '-1')
  input.setAttribute('readonly', '')

  const inputFill = document.createElement('span')
  inputFill.className = 'dnc-input-fill'
  inputFill.setAttribute('aria-hidden', 'true')

  valueWrap.appendChild(input)
  valueWrap.appendChild(inputFill)

  const incrementBtn = document.createElement('span')
  incrementBtn.className = 'dnc-number-increment'

  const incFill = document.createElement('span')
  incFill.className = 'dnc-number-btn-fill'
  incFill.setAttribute('aria-hidden', 'true')
  const incText = document.createElement('span')
  incText.className = 'dnc-number-btn-text'
  incText.textContent = '+'

  incrementBtn.appendChild(incFill)
  incrementBtn.appendChild(incText)

  input.addEventListener('input', () => {
    const parsed = parseFloat(input.value)
    if (!Number.isNaN(parsed)) {
      setValue(parsed)
    }
  })

  attachHoverToFocus(valueWrap, input, {
    duration,
    elementType: 'number-input',
  })

  attachHoverProgress(decrementBtn, {
    duration,
    onInteract: () => setValue(currentValue - step),
    elementType: 'number-input',
    repeat: true,
  })

  attachHoverProgress(incrementBtn, {
    duration,
    onInteract: () => setValue(currentValue + step),
    elementType: 'number-input',
    repeat: true,
  })

  container.addEventListener('click', (e) => {
    e.preventDefault()
    e.stopPropagation()
    throw new DNCClickError('number-input')
  })

  container.appendChild(decrementBtn)
  container.appendChild(valueWrap)
  container.appendChild(incrementBtn)

  setValue(initialValue, false)

  return container
}
