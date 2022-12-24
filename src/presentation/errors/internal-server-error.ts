export class InternalServerError extends Error {
  constructor (errorStack: string) {
    super('Internal Server Error')
    this.name = 'ServerError'
    this.stack = errorStack
  }
}
