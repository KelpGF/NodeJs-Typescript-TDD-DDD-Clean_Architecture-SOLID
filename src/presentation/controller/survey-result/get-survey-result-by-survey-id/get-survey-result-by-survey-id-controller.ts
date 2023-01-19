import { Controller, HttpRequest, HttpResponse, ok, SearchSurveyById } from './get-survey-result-by-survey-id-controller-protocols'

export class GetSurveyResultBySurveyId implements Controller {
  constructor (
    private readonly searchSurveyById: SearchSurveyById
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const surveyId = httpRequest.params?.surveyId
    await this.searchSurveyById.searchById(surveyId)
    return ok({})
  }
}
