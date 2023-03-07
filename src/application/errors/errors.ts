export class NotFoundError extends Error {
  constructor(message: string) {
    super('Not found')
    this.name = 'NotFound'
    this.message = message
  }
}

export class UnauthorizedError extends Error {
  constructor(message: string) {
    super('Unauthorized')
    this.name = 'Unauthorized'
    this.message = message
  }
}

export class InternalServerError extends Error {
  constructor(message: string) {
    super('InternalServerError')
    this.name = 'InternalServerError'
    this.message = message
  }
}

export class BadRequestError extends Error {
  constructor(message: string) {
    super('BadRequestError')
    this.name = 'BadRequestError'
    this.message = message
  }
}
