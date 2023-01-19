import { InvalidParamError } from '@/presentation/errors'
import { Controller, forbidden, GetSurveyResult, HttpRequest, HttpResponse, internalServerError, ok, SearchSurveyById } from './get-survey-result-controller-protocols'

export class GetSurveyResultController implements Controller {
  constructor (
    private readonly searchSurveyById: SearchSurveyById,
    private readonly getSurveyResult: GetSurveyResult
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const surveyId = httpRequest.params.surveyId
      const survey = await this.searchSurveyById.searchById(surveyId)
      if (!survey) return forbidden(new InvalidParamError('surveyId'))

      const surveyResult = await this.getSurveyResult.get(surveyId)
      return ok(surveyResult)
    } catch (error) {
      return internalServerError(error)
    }
  }
}
