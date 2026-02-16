import { attachHoverProgress } from '../hover-progress.js'

export interface RadioOption {
  value: string
  label: string
}

export interface RadioOptions {
  name: string
  options: RadioOption[]
  value: string
  onInteract: (value: string) => void
  legend?: string
  duration?: number
}

export function createRadio(options: RadioOptions): HTMLElement {
  const { name, options: opts, value, onInteract, legend, duration } = options

  const fieldset = document.createElement('fieldset')
  fieldset.className = 'dnc-radio-group'
  fieldset.setAttribute('role', 'radiogroup')

  if (legend) {
    const legendEl = document.createElement('legend')
    legendEl.textContent = legend
    fieldset.appendChild(legendEl)
  }

  const optionElements: HTMLElement[] = []

  opts.forEach((opt) => {
    const optionEl = document.createElement('div')
    optionEl.className = 'dnc-radio-option'
    optionEl.setAttribute('role', 'radio')
    optionEl.setAttribute('aria-checked', String(opt.value === value))
    optionEl.setAttribute('data-value', opt.value)

    const circle = document.createElement('span')
    circle.className = 'dnc-radio-circle'

    const fill = document.createElement('span')
    fill.className = 'dnc-radio-fill'
    fill.setAttribute('aria-hidden', 'true')

    const dot = document.createElement('span')
    dot.className = 'dnc-radio-dot'
    dot.setAttribute('aria-hidden', 'true')

    const labelEl = document.createElement('span')
    labelEl.className = 'dnc-radio-label'
    labelEl.textContent = opt.label

    circle.appendChild(fill)
    circle.appendChild(dot)
    optionEl.appendChild(circle)
    optionEl.appendChild(labelEl)

    const updateSelection = (selectedValue: string) => {
      optionElements.forEach((el) => {
        const isChecked = el.getAttribute('data-value') === selectedValue
        el.setAttribute('aria-checked', String(isChecked))
        el.classList.toggle('dnc-radio-option--checked', isChecked)
      })
    }

    attachHoverProgress(optionEl, {
      duration,
      onInteract: () => {
        onInteract(opt.value)
        updateSelection(opt.value)
      },
      elementType: 'radio',
    })

    optionElements.push(optionEl)
    fieldset.appendChild(optionEl)
  })

  optionElements.forEach((el) => {
    const isChecked = el.getAttribute('data-value') === value
    el.classList.toggle('dnc-radio-option--checked', isChecked)
  })

  return fieldset
}
