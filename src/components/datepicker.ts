import { attachHoverProgress } from '../hover-progress.js'
import { DNCClickError } from '../errors.js'

export interface DatepickerOptions {
  value?: Date
  onInteract: (date: Date) => void
  duration?: number
}

function formatMonth(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'long' })
}

function formatYear(year: number): string {
  return String(year)
}

function getDaysInMonth(year: number, month: number): Date[] {
  const first = new Date(year, month, 1)
  const last = new Date(year, month + 1, 0)
  const days: Date[] = []
  for (let d = 1; d <= last.getDate(); d++) {
    days.push(new Date(year, month, d))
  }
  return days
}

function getPaddingDays(year: number, month: number): number {
  return new Date(year, month, 1).getDay()
}

export function createDatepicker(options: DatepickerOptions): HTMLElement {
  const initialDate = options.value ?? new Date()
  const { onInteract, duration } = options

  const container = document.createElement('div')
  container.className = 'dnc-datepicker'

  let currentMonth = initialDate.getMonth()
  let currentYear = initialDate.getFullYear()

  const header = document.createElement('div')
  header.className = 'dnc-datepicker-header'

  const prevBtn = document.createElement('button')
  prevBtn.type = 'button'
  prevBtn.className = 'dnc-datepicker-nav'
  prevBtn.setAttribute('aria-label', 'Previous month')
  const prevFill = document.createElement('span')
  prevFill.className = 'dnc-datepicker-nav-fill'
  prevFill.setAttribute('aria-hidden', 'true')
  prevBtn.appendChild(prevFill)
  const prevText = document.createElement('span')
  prevText.className = 'dnc-datepicker-nav-text'
  prevText.textContent = '‹'
  prevBtn.appendChild(prevText)

  const monthYearWrap = document.createElement('div')
  monthYearWrap.className = 'dnc-datepicker-month-year'

  const monthLabel = document.createElement('span')
  monthLabel.className = 'dnc-datepicker-month'

  const yearBtn = document.createElement('span')
  yearBtn.className = 'dnc-datepicker-year'
  yearBtn.setAttribute('role', 'button')
  yearBtn.setAttribute('aria-label', 'Select year')
  const yearFill = document.createElement('span')
  yearFill.className = 'dnc-datepicker-year-fill'
  yearFill.setAttribute('aria-hidden', 'true')
  const yearText = document.createElement('span')
  yearText.className = 'dnc-datepicker-year-text'
  yearBtn.appendChild(yearFill)
  yearBtn.appendChild(yearText)

  monthYearWrap.appendChild(monthLabel)
  monthYearWrap.appendChild(yearBtn)

  const nextBtn = document.createElement('button')
  nextBtn.type = 'button'
  nextBtn.className = 'dnc-datepicker-nav'
  nextBtn.setAttribute('aria-label', 'Next month')
  const nextFill = document.createElement('span')
  nextFill.className = 'dnc-datepicker-nav-fill'
  nextFill.setAttribute('aria-hidden', 'true')
  nextBtn.appendChild(nextFill)
  const nextText = document.createElement('span')
  nextText.className = 'dnc-datepicker-nav-text'
  nextText.textContent = '›'
  nextBtn.appendChild(nextText)

  const contentArea = document.createElement('div')
  contentArea.className = 'dnc-datepicker-content'

  const grid = document.createElement('div')
  grid.className = 'dnc-datepicker-grid'

  const yearGrid = document.createElement('div')
  yearGrid.className = 'dnc-datepicker-year-grid'

  let selectedDate: Date | null = options.value ?? null
  let viewMode: 'month' | 'year' = 'month'
  let yearRangeStart = Math.floor(currentYear / 10) * 10

  function render() {
    if (viewMode === 'month') {
      monthLabel.textContent = formatMonth(new Date(currentYear, currentMonth))
      yearText.textContent = formatYear(currentYear)
      monthLabel.hidden = false
      yearBtn.hidden = false
      prevBtn.setAttribute('aria-label', 'Previous month')
      nextBtn.setAttribute('aria-label', 'Next month')
    } else {
      monthLabel.textContent = `${yearRangeStart} – ${yearRangeStart + 11}`
      yearText.textContent = ''
      monthLabel.hidden = false
      yearBtn.hidden = true
      prevBtn.setAttribute('aria-label', 'Previous decade')
      nextBtn.setAttribute('aria-label', 'Next decade')
    }

    contentArea.innerHTML = ''
    if (viewMode === 'month') {
      renderMonthGrid()
      contentArea.appendChild(grid)
    } else {
      renderYearGrid()
      contentArea.appendChild(yearGrid)
    }
  }

  function renderMonthGrid() {
    grid.innerHTML = ''

    const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
    weekdays.forEach((d) => {
      const cell = document.createElement('div')
      cell.className = 'dnc-datepicker-weekday'
      cell.textContent = d
      grid.appendChild(cell)
    })

    const padding = getPaddingDays(currentYear, currentMonth)
    for (let i = 0; i < padding; i++) {
      const cell = document.createElement('div')
      cell.className = 'dnc-datepicker-day dnc-datepicker-day-empty'
      grid.appendChild(cell)
    }

    const days = getDaysInMonth(currentYear, currentMonth)
    days.forEach((date) => {
      const cell = document.createElement('div')
      cell.className = 'dnc-datepicker-day'
      cell.setAttribute('data-date', date.toISOString().slice(0, 10))

      const isSelected =
        selectedDate &&
        date.getDate() === selectedDate.getDate() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear()
      if (isSelected) {
        cell.classList.add('dnc-datepicker-day--selected')
      }

      const fill = document.createElement('span')
      fill.className = 'dnc-datepicker-day-fill'
      fill.setAttribute('aria-hidden', 'true')

      const text = document.createElement('span')
      text.className = 'dnc-datepicker-day-text'
      text.textContent = String(date.getDate())

      cell.appendChild(fill)
      cell.appendChild(text)

      attachHoverProgress(cell, {
        duration,
        onInteract: () => {
          selectedDate = date
          onInteract(date)
          render()
        },
        elementType: 'datepicker',
      })

      grid.appendChild(cell)
    })
  }

  function renderYearGrid() {
    yearGrid.innerHTML = ''

    for (let y = yearRangeStart; y < yearRangeStart + 12; y++) {
      const cell = document.createElement('div')
      cell.className = 'dnc-datepicker-year-cell'
      if (y === currentYear) {
        cell.classList.add('dnc-datepicker-year-cell--current')
      }

      const fill = document.createElement('span')
      fill.className = 'dnc-datepicker-year-cell-fill'
      fill.setAttribute('aria-hidden', 'true')
      const text = document.createElement('span')
      text.className = 'dnc-datepicker-year-cell-text'
      text.textContent = String(y)
      cell.appendChild(fill)
      cell.appendChild(text)

      attachHoverProgress(cell, {
        duration,
        onInteract: () => {
          currentYear = y
          viewMode = 'month'
          yearRangeStart = Math.floor(currentYear / 10) * 10
          render()
        },
        elementType: 'datepicker',
      })
      yearGrid.appendChild(cell)
    }
  }

  attachHoverProgress(yearBtn, {
    duration: 400,
    onInteract: () => {
      viewMode = 'year'
      yearRangeStart = Math.floor(currentYear / 10) * 10
      render()
    },
    elementType: 'datepicker',
  })

  yearBtn.addEventListener('click', (e) => {
    e.preventDefault()
    e.stopPropagation()
    throw new DNCClickError('datepicker')
  })

  attachHoverProgress(prevBtn, {
    duration: 400,
    onInteract: () => {
      if (viewMode === 'month') {
        currentMonth--
        if (currentMonth < 0) {
          currentMonth = 11
          currentYear--
        }
      } else {
        yearRangeStart -= 10
      }
      render()
    },
    elementType: 'datepicker',
  })

  attachHoverProgress(nextBtn, {
    duration: 400,
    onInteract: () => {
      if (viewMode === 'month') {
        currentMonth++
        if (currentMonth > 11) {
          currentMonth = 0
          currentYear++
        }
      } else {
        yearRangeStart += 10
      }
      render()
    },
    elementType: 'datepicker',
  })

  header.appendChild(prevBtn)
  header.appendChild(monthYearWrap)
  header.appendChild(nextBtn)
  container.appendChild(header)
  container.appendChild(contentArea)

  ;[prevBtn, nextBtn].forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault()
      e.stopPropagation()
      throw new DNCClickError('datepicker')
    })
  })

  contentArea.addEventListener('click', (e) => {
    e.preventDefault()
    e.stopPropagation()
    throw new DNCClickError('datepicker')
  })

  render()

  return container
}
