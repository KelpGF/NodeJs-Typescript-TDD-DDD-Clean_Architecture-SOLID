import { internalServerError, ok } from '../../../helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse, ListSurvey } from './list-surveys-controller-protocols'

export class ListSurveyController implements Controller {
  constructor (
    private readonly listSurvey: ListSurvey
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const surveys = await this.listSurvey.list()
      return ok(surveys)
    } catch (error) {
      return internalServerError(error)
    }
  }
}
