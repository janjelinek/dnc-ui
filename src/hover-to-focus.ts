import { attachHoverProgress } from './hover-progress.js'
import { DNCClickError } from './errors.js'

export interface HoverToFocusOptions {
  duration?: number
  onActivate?: () => void
  elementType: string
}

/**
 * Attaches hover-to-focus behavior: hover fills progress bar, on complete the input
 * is activated (readonly removed, focused). Used for text inputs, textarea, etc.
 */
export function attachHoverToFocus(
  wrapper: HTMLElement,
  input: HTMLInputElement | HTMLTextAreaElement,
  options: HoverToFocusOptions
): void {
  const { onActivate, elementType } = options

  function activate(): void {
    input.removeAttribute('readonly')
    input.setAttribute('tabindex', '0')
    input.focus()
    onActivate?.()
  }

  function resetToDormant(): void {
    input.setAttribute('readonly', '')
    input.setAttribute('tabindex', '-1')
  }

  attachHoverProgress(wrapper, {
    duration: options.duration,
    onInteract: activate,
    elementType,
  })

  input.addEventListener('blur', resetToDormant)

  wrapper.addEventListener('click', (e) => {
    e.preventDefault()
    e.stopPropagation()
    throw new DNCClickError(elementType)
  })
}
