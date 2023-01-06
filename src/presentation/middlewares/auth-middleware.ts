import { forbidden, internalServerError, ok } from '../helpers/http/http-helper'
import { AccessDeniedError } from '../errors/access-denied-error'
import { HttpRequest, HttpResponse, Middleware } from '../protocols'
import { FindAccountByToken } from '../../domain/usecases/find-account-by-token'

export class AuthMiddleware implements Middleware {
  constructor (private readonly findAccountByToken: FindAccountByToken) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accessToken = httpRequest.headers?.['x-access-token']
      if (accessToken) {
        const account = await this.findAccountByToken.find(accessToken)

        if (account) return ok({ accountId: account.id })
      }

      return forbidden(new AccessDeniedError())
    } catch (error) {
      return internalServerError(error)
    }
  }
}
