import { attachHoverProgress } from '../hover-progress.js'

export interface CheckboxOptions {
  label: string
  checked: boolean
  onInteract: (checked: boolean) => void
  duration?: number
}

export function createCheckbox(options: CheckboxOptions): HTMLElement {
  const { label, checked, onInteract, duration } = options

  const labelEl = document.createElement('label')
  labelEl.className = 'dnc-checkbox'
  labelEl.setAttribute('role', 'checkbox')
  labelEl.setAttribute('aria-checked', String(checked))

  const box = document.createElement('span')
  box.className = 'dnc-checkbox-box'

  const fill = document.createElement('span')
  fill.className = 'dnc-checkbox-fill'
  fill.setAttribute('aria-hidden', 'true')

  const check = document.createElement('span')
  check.className = 'dnc-checkbox-check'
  check.setAttribute('aria-hidden', 'true')
  check.textContent = '✓'

  const labelText = document.createElement('span')
  labelText.className = 'dnc-checkbox-label'
  labelText.textContent = label

  box.appendChild(fill)
  box.appendChild(check)
  labelEl.appendChild(box)
  labelEl.appendChild(labelText)

  let currentChecked = checked
  const updateChecked = (value: boolean) => {
    currentChecked = value
    labelEl.setAttribute('aria-checked', String(value))
    labelEl.classList.toggle('dnc-checkbox--checked', value)
  }

  updateChecked(checked)

  attachHoverProgress(labelEl, {
    duration,
    onInteract: () => {
      currentChecked = !currentChecked
      onInteract(currentChecked)
      updateChecked(currentChecked)
    },
    elementType: 'checkbox',
  })

  return labelEl
}
