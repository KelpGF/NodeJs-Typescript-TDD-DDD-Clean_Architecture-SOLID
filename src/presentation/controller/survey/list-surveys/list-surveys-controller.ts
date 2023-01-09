import { Controller, HttpRequest, HttpResponse, ListSurveys } from './list-surveys-controller-protocols'
import { internalServerError, noContent, ok } from '@/presentation/helpers/http/http-helper'

export class ListSurveyController implements Controller {
  constructor (
    private readonly listSurvey: ListSurveys
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const surveys = await this.listSurvey.list()
      return surveys.length ? ok(surveys) : noContent()
    } catch (error) {
      return internalServerError(error)
    }
  }
}
