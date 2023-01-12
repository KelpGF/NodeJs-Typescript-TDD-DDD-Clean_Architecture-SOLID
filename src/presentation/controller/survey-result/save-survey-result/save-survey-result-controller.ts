import { Controller, HttpRequest, HttpResponse, ok, SearchSurveyById } from './save-survey-result-controller-protocols'

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly searchSurveyById: SearchSurveyById
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    await this.searchSurveyById.searchById(httpRequest.params?.surveyId)
    return ok({})
  }
}
