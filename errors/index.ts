
export class InvalidRequestError extends Error {
  constructor(message = '') {
    super(message)
    this.name = 'InvalidRequestError'
    if (message) this.message = message
    else this.message = 'Invalid request'
  }
}

export class NotFoundError extends Error {
  constructor(message = 'Response not found') {
    super(message)
    this.name = 'NotFoundError'
  }
}
