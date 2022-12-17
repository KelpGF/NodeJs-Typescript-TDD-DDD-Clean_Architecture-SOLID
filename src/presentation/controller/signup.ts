import { badRequest, internalServerError } from '../helpers/http-helper'
import { MissingParamError } from '../errors/missing-param-error'
import { httpRequest, HttpResponse } from '../protocol/http'
import { Controller } from '../protocol/controller'
import { EmailValidator } from '../protocol/email-validator'
import { InvalidParamError } from '../errors/invalid-param-error'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  handle (httpRequest: httpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const emailIsValid = this.emailValidator.isValid(httpRequest.body.email)

      if (!emailIsValid) return badRequest(new InvalidParamError('email'))

      return { statusCode: 200, body: {} }
    } catch (err) {
      return internalServerError()
    }
  }
}
