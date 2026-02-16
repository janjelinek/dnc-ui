/** Thrown when user clicks a DNC element. Consumer catches and shows funny message. */
export class DNCClickError extends Error {
  constructor(public readonly element: string) {
    super(`DNC: Click detected on ${element}`)
    this.name = 'DNCClickError'
    Object.setPrototypeOf(this, DNCClickError.prototype)
  }
}
