import { badRequest } from '../../helpers/http-helper'
import { MissingParamError } from '../errors/missing-params-error'
import { httpRequest, HttpResponse } from '../protocol/http'

export class SignUpController {
  handle (httpRequest: httpRequest): HttpResponse {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }

    return { statusCode: 200, body: {} }
  }
}
