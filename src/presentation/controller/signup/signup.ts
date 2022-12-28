import { badRequest, internalServerError, ok } from '../../helpers/http-helper'
import { InvalidParamError } from '../../errors'
import { Controller, HttpRequest, HttpResponse, EmailValidator, AddAccount, Validation } from './signup-protocols'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount
  private readonly validation: Validation

  constructor (emailValidator: EmailValidator, addAccount: AddAccount, validation: Validation) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
    this.validation = validation
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) return badRequest(error)

      const { name, email, password } = httpRequest.body

      const emailIsValid = this.emailValidator.isValid(email)
      if (!emailIsValid) return badRequest(new InvalidParamError('email'))

      const newAccount = await this.addAccount.add({ name, email, password })

      return ok(newAccount)
    } catch (err) {
      return internalServerError(err)
    }
  }
}
