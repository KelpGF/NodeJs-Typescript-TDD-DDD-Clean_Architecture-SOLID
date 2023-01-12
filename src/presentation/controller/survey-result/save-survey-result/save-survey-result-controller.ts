import { InvalidParamError } from '@/presentation/errors'
import { Controller, forbidden, HttpRequest, HttpResponse, internalServerError, ok, SearchSurveyById } from './save-survey-result-controller-protocols'

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly searchSurveyById: SearchSurveyById
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const survey = await this.searchSurveyById.searchById(httpRequest.params?.surveyId)
      if (!survey) return forbidden(new InvalidParamError('surveyId'))
      return ok({})
    } catch (error) {
      return internalServerError(error)
    }
  }
}
