import { InvalidParamError } from '@/presentation/errors'
import { Controller, forbidden, HttpRequest, HttpResponse, ok, SearchSurveyById } from './get-survey-result-by-survey-id-controller-protocols'

export class GetSurveyResultBySurveyId implements Controller {
  constructor (
    private readonly searchSurveyById: SearchSurveyById
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const surveyId = httpRequest.params?.surveyId
    const survey = await this.searchSurveyById.searchById(surveyId)
    if (!survey) return forbidden(new InvalidParamError('surveyId'))

    return ok({})
  }
}
