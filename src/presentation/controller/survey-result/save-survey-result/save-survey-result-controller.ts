import { InvalidParamError } from '@/presentation/errors'
import { Controller, forbidden, HttpRequest, HttpResponse, internalServerError, ok, SearchSurveyById, SaveSurveyResult } from './save-survey-result-controller-protocols'

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly searchSurveyById: SearchSurveyById,
    private readonly saveSurveyResult: SaveSurveyResult
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params
      const { answer } = httpRequest.body

      const survey = await this.searchSurveyById.searchById(surveyId)
      if (!survey) return forbidden(new InvalidParamError('surveyId'))

      const surveyAnswer = survey.answers.find((surveyAnswer) => surveyAnswer.answer === answer)
      if (!surveyAnswer) return forbidden(new InvalidParamError('answer'))

      const surveyResult = await this.saveSurveyResult.save({
        surveyId: survey.id,
        accountId: String(httpRequest.accountId),
        answer: surveyAnswer.answer,
        date: new Date()
      })

      return ok(surveyResult)
    } catch (error) {
      console.log(error)
      return internalServerError(error)
    }
  }
}
