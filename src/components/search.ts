import { attachHoverToFocus } from '../hover-to-focus.js'
import { attachHoverProgress } from '../hover-progress.js'

export interface SearchOptions {
  placeholder?: string
  value: string
  onInteract: (value: string) => void
  onSearch?: (query: string) => void
  debounce?: number
  duration?: number
}

export function createSearch(options: SearchOptions): HTMLElement {
  const {
    placeholder = 'Search...',
    value,
    onInteract,
    onSearch,
    debounce = 300,
    duration,
  } = options

  const wrapper = document.createElement('div')
  wrapper.className = 'dnc-search-wrapper'

  const inputWrap = document.createElement('div')
  inputWrap.className = 'dnc-search-input-wrap'

  const icon = document.createElement('span')
  icon.className = 'dnc-search-icon'
  icon.setAttribute('aria-hidden', 'true')
  icon.textContent = '🔍'

  const input = document.createElement('input')
  input.className = 'dnc-input dnc-search-input'
  input.type = 'search'
  input.placeholder = placeholder
  input.value = value
  input.setAttribute('tabindex', '-1')
  input.setAttribute('readonly', '')

  const fill = document.createElement('span')
  fill.className = 'dnc-input-fill'
  fill.setAttribute('aria-hidden', 'true')

  const clearBtn = document.createElement('span')
  clearBtn.className = 'dnc-search-clear'
  clearBtn.setAttribute('aria-label', 'Clear search')
  clearBtn.textContent = '✕'

  function updateClearVisibility(): void {
    clearBtn.classList.toggle('dnc-search-clear--visible', input.value.length > 0)
  }

  input.addEventListener('input', () => {
    onInteract(input.value)
    updateClearVisibility()
  })

  let debounceTimer: number
  if (onSearch) {
    input.addEventListener('input', () => {
      clearTimeout(debounceTimer)
      debounceTimer = window.setTimeout(() => {
        onSearch(input.value)
      }, debounce)
    })
  }

  attachHoverToFocus(inputWrap, input, {
    duration,
    elementType: 'search',
  })

  attachHoverProgress(clearBtn, {
    duration,
    onInteract: () => {
      input.value = ''
      onInteract('')
      updateClearVisibility()
      if (onSearch) onSearch('')
    },
    elementType: 'search',
  })

  inputWrap.appendChild(icon)
  inputWrap.appendChild(input)
  inputWrap.appendChild(fill)
  wrapper.appendChild(inputWrap)
  wrapper.appendChild(clearBtn)

  updateClearVisibility()

  return wrapper
}
