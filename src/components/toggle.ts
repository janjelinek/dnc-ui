import { attachHoverProgress } from '../hover-progress.js'

export interface ToggleOptions {
  label: string
  checked: boolean
  onInteract: (checked: boolean) => void
  duration?: number
}

export function createToggle(options: ToggleOptions): HTMLElement {
  const { label, checked, onInteract, duration } = options

  const labelEl = document.createElement('label')
  labelEl.className = 'dnc-toggle'
  labelEl.setAttribute('role', 'switch')
  labelEl.setAttribute('aria-checked', String(checked))

  const track = document.createElement('span')
  track.className = 'dnc-toggle-track'

  const fill = document.createElement('span')
  fill.className = 'dnc-toggle-fill'
  fill.setAttribute('aria-hidden', 'true')

  const thumb = document.createElement('span')
  thumb.className = 'dnc-toggle-thumb'

  const labelText = document.createElement('span')
  labelText.className = 'dnc-toggle-label'
  labelText.textContent = label

  track.appendChild(fill)
  track.appendChild(thumb)
  labelEl.appendChild(track)
  labelEl.appendChild(labelText)

  let currentChecked = checked
  const updateChecked = (value: boolean) => {
    currentChecked = value
    labelEl.setAttribute('aria-checked', String(value))
    labelEl.classList.toggle('dnc-toggle--checked', value)
  }

  updateChecked(checked)

  attachHoverProgress(labelEl, {
    duration,
    onInteract: () => {
      currentChecked = !currentChecked
      onInteract(currentChecked)
      updateChecked(currentChecked)
    },
    elementType: 'toggle',
  })

  return labelEl
}
