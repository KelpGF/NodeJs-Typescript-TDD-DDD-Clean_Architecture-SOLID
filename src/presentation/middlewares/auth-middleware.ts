import { forbidden, internalServerError, ok } from '../helpers/http/http-helper'
import { AccessDeniedError } from '../errors/access-denied-error'
import { HttpRequest, HttpResponse, Middleware, SearchAccountByToken } from './auth-middleware-protocols'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly SearchAccountByToken: SearchAccountByToken,
    private readonly role: string | undefined
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accessToken = httpRequest.headers?.['x-access-token']
      if (accessToken) {
        const account = await this.SearchAccountByToken.search(accessToken, this.role)

        if (account) return ok({ accountId: account.id })
      }

      return forbidden(new AccessDeniedError())
    } catch (error) {
      return internalServerError(error)
    }
  }
}
