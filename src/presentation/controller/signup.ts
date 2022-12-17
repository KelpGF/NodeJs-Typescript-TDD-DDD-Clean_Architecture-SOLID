import { MissingParamError } from '../errors/missing-params-error'
import { httpRequest, HttpResponse } from '../protocol/http'

export class SignUpController {
  handle (httpRequest: httpRequest): HttpResponse {
    if (!httpRequest.body.name) {
      return { statusCode: 400, body: new MissingParamError('name') }
    }

    if (!httpRequest.body.email) {
      return { statusCode: 400, body: new MissingParamError('email') }
    }

    return { statusCode: 200, body: {} }
  }
}
