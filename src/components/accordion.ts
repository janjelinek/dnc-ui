import { attachHoverProgress } from '../hover-progress.js'
import { DNCClickError } from '../errors.js'

export interface AccordionItem {
  id: string
  title: string
  content: HTMLElement | string
}

export interface AccordionOptions {
  items: AccordionItem[]
  expandedIds?: string[]
  multiple?: boolean
  onInteract: (expandedIds: string[]) => void
  duration?: number
}

export function createAccordion(options: AccordionOptions): HTMLElement {
  const {
    items,
    expandedIds = [],
    multiple = false,
    onInteract,
    duration,
  } = options

  const accordion = document.createElement('div')
  accordion.className = 'dnc-accordion'

  items.forEach((item) => {
    const isExpanded = expandedIds.includes(item.id)

    const itemEl = document.createElement('div')
    itemEl.className = 'dnc-accordion-item'
    if (isExpanded) itemEl.classList.add('dnc-accordion-item--expanded')

    const header = document.createElement('div')
    header.className = 'dnc-accordion-header'
    header.setAttribute('role', 'button')
    header.setAttribute('aria-expanded', String(isExpanded))
    header.setAttribute('aria-controls', `dnc-accordion-content-${item.id}`)
    header.setAttribute('data-id', item.id)

    const fill = document.createElement('span')
    fill.className = 'dnc-accordion-fill'
    fill.setAttribute('aria-hidden', 'true')

    const title = document.createElement('span')
    title.className = 'dnc-accordion-title'
    title.textContent = item.title

    const chevron = document.createElement('span')
    chevron.className = 'dnc-accordion-chevron'
    chevron.setAttribute('aria-hidden', 'true')
    chevron.textContent = '▾'

    header.appendChild(fill)
    header.appendChild(title)
    header.appendChild(chevron)

    const content = document.createElement('div')
    content.id = `dnc-accordion-content-${item.id}`
    content.className = 'dnc-accordion-content'
    content.setAttribute('role', 'region')
    header.id = `dnc-accordion-header-${item.id}`
    content.setAttribute('aria-labelledby', header.id)
    const contentInner = document.createElement('div')
    contentInner.className = 'dnc-accordion-content-inner'
    if (typeof item.content === 'string') {
      contentInner.textContent = item.content
    } else {
      contentInner.appendChild(item.content)
    }
    content.appendChild(contentInner)

    attachHoverProgress(header, {
      duration,
      onInteract: () => {
        const currentlyExpanded = expandedIds.includes(item.id)
        const newExpanded = multiple
          ? (currentlyExpanded ? expandedIds.filter((id) => id !== item.id) : [...expandedIds, item.id])
          : (currentlyExpanded ? [] : [item.id])
        onInteract(newExpanded)
      },
      elementType: 'accordion',
    })

    header.addEventListener('click', (e) => {
      e.preventDefault()
      e.stopPropagation()
      throw new DNCClickError('accordion')
    })

    itemEl.appendChild(header)
    itemEl.appendChild(content)
    accordion.appendChild(itemEl)
  })

  return accordion
}
