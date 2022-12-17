import { httpRequest, HttpResponse } from '../protocol/http'

export class SignUpController {
  handle (httpRequest: httpRequest): HttpResponse {
    if (!httpRequest.body.name) {
      return { statusCode: 400, body: new Error('Missing param: name') }
    }

    if (!httpRequest.body.email) {
      return { statusCode: 400, body: new Error('Missing param: email') }
    }

    return { statusCode: 200, body: {} }
  }
}
