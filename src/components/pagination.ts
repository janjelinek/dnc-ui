import { attachHoverProgress } from '../hover-progress.js'
import { DNCClickError } from '../errors.js'

export interface PaginationOptions {
  totalPages: number
  currentPage: number
  onInteract: (page: number) => void
  maxVisible?: number
  duration?: number
}

export function createPagination(options: PaginationOptions): HTMLElement {
  const {
    totalPages,
    currentPage,
    onInteract,
    maxVisible = 7,
    duration,
  } = options

  const nav = document.createElement('nav')
  nav.className = 'dnc-pagination'
  nav.setAttribute('aria-label', 'Pagination')

  let current = currentPage

  function render(): void {
    nav.innerHTML = ''

    const prevBtn = document.createElement('span')
    prevBtn.className = 'dnc-pagination-btn dnc-pagination-prev'
    prevBtn.textContent = '‹'
    prevBtn.setAttribute('aria-label', 'Previous page')
    const prevFill = document.createElement('span')
    prevFill.className = 'dnc-pagination-btn-fill'
    prevFill.setAttribute('aria-hidden', 'true')
    prevBtn.appendChild(prevFill)
    const prevText = document.createElement('span')
    prevText.className = 'dnc-pagination-btn-text'
    prevText.textContent = '‹'
    prevBtn.appendChild(prevText)

    if (current > 1) {
      attachHoverProgress(prevBtn, {
        duration,
        onInteract: () => {
          current--
          onInteract(current)
          render()
        },
        elementType: 'pagination',
      })
    }
    nav.appendChild(prevBtn)

    const pages = getPageNumbers(current, totalPages, maxVisible)
    pages.forEach((p) => {
      if (p === 'ellipsis') {
        const ellipsis = document.createElement('span')
        ellipsis.className = 'dnc-pagination-ellipsis'
        ellipsis.textContent = '…'
        nav.appendChild(ellipsis)
        return
      }

      const pageNum = p as number
      const btn = document.createElement('span')
      btn.className = 'dnc-pagination-btn dnc-pagination-page'
      btn.setAttribute('data-page', String(pageNum))

      const fill = document.createElement('span')
      fill.className = 'dnc-pagination-btn-fill'
      fill.setAttribute('aria-hidden', 'true')
      const text = document.createElement('span')
      text.className = 'dnc-pagination-btn-text'
      text.textContent = String(pageNum)
      btn.appendChild(fill)
      btn.appendChild(text)

      if (pageNum === current) {
        btn.classList.add('dnc-pagination--active')
      } else {
        attachHoverProgress(btn, {
          duration,
          onInteract: () => {
            current = pageNum
            onInteract(current)
            render()
          },
          elementType: 'pagination',
        })
      }
      nav.appendChild(btn)
    })

    const nextBtn = document.createElement('span')
    nextBtn.className = 'dnc-pagination-btn dnc-pagination-next'
    nextBtn.textContent = '›'
    nextBtn.setAttribute('aria-label', 'Next page')
    const nextFill = document.createElement('span')
    nextFill.className = 'dnc-pagination-btn-fill'
    nextFill.setAttribute('aria-hidden', 'true')
    nextBtn.appendChild(nextFill)
    const nextText = document.createElement('span')
    nextText.className = 'dnc-pagination-btn-text'
    nextText.textContent = '›'
    nextBtn.appendChild(nextText)

    if (current < totalPages) {
      attachHoverProgress(nextBtn, {
        duration,
        onInteract: () => {
          current++
          onInteract(current)
          render()
        },
        elementType: 'pagination',
      })
    }
    nav.appendChild(nextBtn)
  }

  function getPageNumbers(
    curr: number,
    total: number,
    max: number
  ): (number | 'ellipsis')[] {
    if (total <= max) {
      return Array.from({ length: total }, (_, i) => i + 1)
    }
    const result: (number | 'ellipsis')[] = []
    const half = Math.floor(max / 2)
    let start = Math.max(1, curr - half)
    let end = Math.min(total, start + max - 1)
    if (end - start + 1 < max) {
      start = Math.max(1, end - max + 1)
    }
    if (start > 1) {
      result.push(1)
      if (start > 2) result.push('ellipsis')
    }
    for (let i = start; i <= end; i++) result.push(i)
    if (end < total) {
      if (end < total - 1) result.push('ellipsis')
      result.push(total)
    }
    return result
  }

  render()

  nav.addEventListener('click', (e) => {
    e.preventDefault()
    e.stopPropagation()
    throw new DNCClickError('pagination')
  })

  return nav
}
