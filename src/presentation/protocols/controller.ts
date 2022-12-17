import { httpRequest, HttpResponse } from './http'

export interface Controller {
  handle: (httpRequest: httpRequest) => HttpResponse
}
