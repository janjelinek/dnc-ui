import { attachHoverProgress } from '../hover-progress.js'

export interface TabItem {
  id: string
  label: string
  icon?: string
}

export interface TabsOptions {
  tabs: TabItem[]
  activeId: string
  onInteract: (tabId: string) => void
  duration?: number
}

export function createTabs(options: TabsOptions): HTMLElement {
  const { tabs, activeId, onInteract, duration } = options

  const container = document.createElement('div')
  container.className = 'dnc-tabs'
  container.setAttribute('role', 'tablist')

  let currentActiveId = activeId

  function updateActive(): void {
    container.querySelectorAll('.dnc-tab').forEach((el) => {
      const tabEl = el as HTMLElement
      const id = tabEl.getAttribute('data-tab-id')
      const isActive = id === currentActiveId
      tabEl.classList.toggle('dnc-tab--active', isActive)
      tabEl.setAttribute('aria-selected', String(isActive))
    })
  }

  tabs.forEach((tab) => {
    const tabEl = document.createElement('div')
    tabEl.className = 'dnc-tab'
    tabEl.setAttribute('role', 'tab')
    tabEl.setAttribute('data-tab-id', tab.id)
    tabEl.setAttribute('aria-selected', String(tab.id === currentActiveId))

    const fill = document.createElement('span')
    fill.className = 'dnc-tab-fill'
    fill.setAttribute('aria-hidden', 'true')

    const text = document.createElement('span')
    text.className = 'dnc-tab-text'
    text.textContent = tab.label

    const indicator = document.createElement('span')
    indicator.className = 'dnc-tab-indicator'
    indicator.setAttribute('aria-hidden', 'true')

    tabEl.appendChild(fill)
    if (tab.icon) {
      const iconEl = document.createElement('span')
      iconEl.className = 'dnc-tab-icon'
      iconEl.textContent = tab.icon
      tabEl.appendChild(iconEl)
    }
    tabEl.appendChild(text)
    tabEl.appendChild(indicator)

    attachHoverProgress(tabEl, {
      duration,
      onInteract: () => {
        currentActiveId = tab.id
        onInteract(tab.id)
        updateActive()
      },
      elementType: 'tabs',
    })

    container.appendChild(tabEl)
  })

  updateActive()

  return container
}
