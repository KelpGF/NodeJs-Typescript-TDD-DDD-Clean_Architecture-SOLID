import { badRequest, internalServerError, ok, unauthorizedError } from '../../helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse, AddAccount, Validation, Authentication } from './signup-controller-protocols'

export class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) return badRequest(error)

      const { name, email, password } = httpRequest.body
      const newAccount = await this.addAccount.add({ name, email, password })

      const accessToken = await this.authentication.auth({ email, password })
      if (!accessToken) return unauthorizedError()

      return ok(newAccount)
    } catch (err) {
      return internalServerError(err)
    }
  }
}
