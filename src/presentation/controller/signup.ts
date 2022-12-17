import { badRequest, internalServerError } from '../helpers/http-helper'
import { MissingParamError, InvalidParamError } from '../errors'
import { Controller, EmailValidator, httpRequest, HttpResponse } from '../protocols'
import { AddAccount } from '../../domain/usecases/add-account'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount

  constructor (emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  handle (httpRequest: httpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) return badRequest(new MissingParamError(field))
      }

      const { name, email, password, passwordConfirmation } = httpRequest.body

      if (password !== passwordConfirmation) return badRequest(new InvalidParamError('passwordConfirmation'))

      const emailIsValid = this.emailValidator.isValid(email)
      if (!emailIsValid) return badRequest(new InvalidParamError('email'))

      const newAccount = this.addAccount.add({ name, email, password })

      return { statusCode: 200, body: newAccount }
    } catch (err) {
      return internalServerError()
    }
  }
}
