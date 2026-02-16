export interface DNCConfig {
  duration: number
}

const DEFAULT_CONFIG: DNCConfig = {
  duration: 1500,
}

let currentConfig: DNCConfig = { ...DEFAULT_CONFIG }

export function configure(overrides: Partial<DNCConfig>): void {
  currentConfig = { ...currentConfig, ...overrides }
}

export function getConfig(): Readonly<DNCConfig> {
  return { ...currentConfig }
}

export function getDefaultDuration(): number {
  return currentConfig.duration
}
