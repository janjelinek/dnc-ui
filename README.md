# DNC UI

Minimal, stateless UI library for "do not click" interactions. All controls work via hover + wait. On click, throws `DNCClickError`.

## Install

```bash
yarn add dnc-ui
# or
npm install dnc-ui
```

## Setup

Import both the library and its styles. **Both are required** — without styles, components render but look broken.

```ts
import { DNC, DNCClickError } from 'dnc-ui'
import 'dnc-ui/styles.css'

// Catch clicks (required)
window.addEventListener('error', (e) => {
  if (e.error instanceof DNCClickError) {
    alert('You clicked! Try hovering instead.')
  }
})
```

## Configuration

Set global defaults for all DNC components:

```ts
import { DNC } from 'dnc-ui'
import 'dnc-ui/styles.css'

// Set global hover duration (default: 1500ms)
DNC.configure({ duration: 2000 })

// Read current config
DNC.getConfig() // => { duration: 2000 }

// Per-component override still works — takes priority over global
DNC.button({
  label: 'Quick action',
  onInteract: () => {},
  duration: 500,  // this button activates in 500ms regardless of global
})
```

Resolution order: per-component `duration` → global `DNC.configure({ duration })` → built-in default (1500ms).

## Theming

Override CSS variables to style all components at once. Import dnc-ui styles first, then override:

```css
/* After importing dnc-ui/styles.css */
:root {
  --dnc-progress-color: #58a6ff;   /* Animated bar color (buttons, checkboxes, etc.) */
  --dnc-bg: #21262d;                /* Background */
  --dnc-border: #30363d;             /* Borders */
  --dnc-input-color: #e6edf3;       /* Text color */
  --dnc-fill-duration: 1.5s;        /* Animation speed */
}
```

**Dark theme example:**
```css
:root {
  --dnc-progress-color: #58a6ff;
  --dnc-bg: #161b22;
  --dnc-border: #30363d;
  --dnc-input-color: #e6edf3;
}
```

**Custom progress color for specific elements:**
```css
.nav-btn .dnc-button-fill {
  background: #58a6ff;  /* Override just nav buttons */
}

.my-theme .dnc-button-fill,
.my-theme .dnc-checkbox-fill {
  background: #10b981;  /* Green accent for a section */
}
```

Progress fill elements use `border-radius: inherit` so they match the parent. Style the parent (e.g. `.nav-btn { border-radius: 0.5rem }`) and the fill will follow.

## Usage

Assumes Setup above. Example component usage:

```ts
// Button
const btn = DNC.button({
  label: 'Submit',
  onInteract: () => console.log('Submitted!'),
})
document.body.appendChild(btn)

// Select
const select = DNC.select({
  options: [{ value: 'a', label: 'Option A' }, { value: 'b', label: 'Option B' }],
  onInteract: (value) => console.log('Selected:', value),
})
document.body.appendChild(select)

// Slider
const slider = DNC.slider({
  min: 0, max: 100,
  onInteract: (value) => console.log('Value:', value),
})
document.body.appendChild(slider)

// Datepicker
const datepicker = DNC.datepicker({
  onInteract: (date) => console.log('Date:', date),
})
document.body.appendChild(datepicker)

// Checkbox
const checkbox = DNC.checkbox({
  label: 'Accept terms',
  checked: false,
  onInteract: (checked) => console.log('Checked:', checked),
})
document.body.appendChild(checkbox)

// Radio
const radio = DNC.radio({
  name: 'color',
  options: [{ value: 'red', label: 'Red' }, { value: 'blue', label: 'Blue' }],
  value: 'red',
  onInteract: (value) => console.log('Selected:', value),
})
document.body.appendChild(radio)

// Toggle
const toggle = DNC.toggle({
  label: 'Dark mode',
  checked: false,
  onInteract: (checked) => console.log('Toggle:', checked),
})
document.body.appendChild(toggle)

// Carousel — hover arrows or swipe mouse quickly left/right
const carousel = DNC.carousel({
  slides: ['<div>Slide 1</div>', '<div>Slide 2</div>'],
  onInteract: (index) => console.log('Slide:', index),
})
document.body.appendChild(carousel)
```

## Plain HTML

```html
<script type="module">
  import { DNC, DNCClickError } from 'https://cdn.example.com/dnc-ui.js'
  import 'https://cdn.example.com/dnc-ui.css'
  window.addEventListener('error', (e) => {
    if (e.error instanceof DNCClickError) alert('No clicking!')
  })
  document.body.appendChild(DNC.button({ label: 'Go', onInteract: () => alert('Done!') }))
</script>
```

## React / Vite / Next.js

Import DNC and `dnc-ui/styles.css`, then use in `useEffect` or `ref` to mount. Catch `DNCClickError` in an error boundary or `window.addEventListener('error', ...)`.

---

## Publishing (maintainers)

The package builds automatically before publish (`prepublishOnly`). For local development, run `npm run build` to compile TypeScript to `dist/`.

```bash
cd dnc-ui
npm run build   # Compiles src/ → dist/ (optional — runs automatically on publish)
npm login
npm publish
```

**Published contents**: `dist/` (compiled JS + types) and `src/styles/` (CSS). Styles are separate from JS — consumers import `dnc-ui/styles.css` explicitly. This is standard for UI libraries and allows bundlers to handle CSS correctly.

If the name `dnc-ui` is taken, use a scoped package: set `"name": "@janjelinek/dnc-ui"` in `package.json`, then `npm publish --access public`.
