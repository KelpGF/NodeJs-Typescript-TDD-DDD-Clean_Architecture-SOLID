import { InvalidParamError } from '@/presentation/errors'
import { Controller, forbidden, HttpRequest, HttpResponse, internalServerError, ok, SearchSurveyById } from './save-survey-result-controller-protocols'

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly searchSurveyById: SearchSurveyById
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params || {}
      const { answer } = httpRequest.body || {}

      const survey = await this.searchSurveyById.searchById(surveyId)
      if (!survey) return forbidden(new InvalidParamError('surveyId'))

      const surveyAnswer = survey.answers.find((surveyAnswer) => surveyAnswer === answer)
      if (!surveyAnswer) return forbidden(new InvalidParamError('answer'))

      return ok({})
    } catch (error) {
      return internalServerError(error)
    }
  }
}
