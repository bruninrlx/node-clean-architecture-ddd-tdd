export class NotFoundError extends Error {
  constructor(message: string) {
    super('Not found')
    this.name = 'NotFoundError'
    this.message = message
  }
}

export class UnauthorizedError extends Error {
  constructor(message: string) {
    super('Unauthorized')
    this.name = 'UnauthorizedError'
    this.message = message
  }
}
