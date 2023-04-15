class WingsError extends Error {
  constructor(message: string) {
    super(`${new Date().toISOString()} ${message}`)
    this.name = 'WingsError'

    Object.setPrototypeOf(this, WingsError.prototype)
  }
}
