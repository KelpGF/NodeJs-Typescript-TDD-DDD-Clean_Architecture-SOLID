import { forbidden } from '../helpers/http/http-helper'
import { AccessDeniedError } from '../errors/access-denied-error'
import { HttpRequest, HttpResponse, Middleware } from '../protocols'
import { FindAccountByToken } from '../../domain/usecases/find-account-by-token'

export class AuthMiddleware implements Middleware {
  constructor (private readonly findAccountByToken: FindAccountByToken) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const accessToken = httpRequest.headers?.['x-access-token']
    if (accessToken) {
      await this.findAccountByToken.find(accessToken)
    }

    return forbidden(new AccessDeniedError())
  }
}
