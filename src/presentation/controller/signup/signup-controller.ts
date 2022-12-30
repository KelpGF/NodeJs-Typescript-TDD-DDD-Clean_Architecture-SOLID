import { badRequest, internalServerError, ok } from '../../helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse, AddAccount, Validation } from './signup-controller-protocols'

export class SignUpController implements Controller {
  private readonly addAccount: AddAccount
  private readonly validation: Validation

  constructor (addAccount: AddAccount, validation: Validation) {
    this.addAccount = addAccount
    this.validation = validation
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) return badRequest(error)

      const { name, email, password } = httpRequest.body
      const newAccount = await this.addAccount.add({ name, email, password })

      return ok(newAccount)
    } catch (err) {
      return internalServerError(err)
    }
  }
}
