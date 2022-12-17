import { badRequest } from '../../helpers/http-helper'
import { MissingParamError } from '../errors/missing-params-error'
import { httpRequest, HttpResponse } from '../protocol/http'

export class SignUpController {
  handle (httpRequest: httpRequest): HttpResponse {
    if (!httpRequest.body.name) {
      return badRequest(new MissingParamError('name'))
    }

    if (!httpRequest.body.email) {
      return badRequest(new MissingParamError('email'))
    }

    return { statusCode: 200, body: {} }
  }
}
