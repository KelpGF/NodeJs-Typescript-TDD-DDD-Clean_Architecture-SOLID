import {
  GetSurveyResult,
  FindSurveyByIdRepository,
  FindSurveyResultBySurveyIdRepository,
  SurveyResultModel,
  SurveyModel
} from './db-get-survey-result-protocols'

export class DbGetSurveyResult implements GetSurveyResult {
  constructor (
    private readonly findSurveyResultBySurveyIdRepository: FindSurveyResultBySurveyIdRepository,
    private readonly findSurveyByIdRepository: FindSurveyByIdRepository
  ) {}

  async get (surveyId: string): Promise<SurveyResultModel> {
    const surveyResult = await this.findSurveyResultBySurveyIdRepository.findBySurveyId(surveyId)
    if (surveyResult) return surveyResult

    const survey: SurveyModel = await this.findSurveyByIdRepository.findById(surveyId) as SurveyModel
    return {
      surveyId: survey.id,
      date: survey.date,
      question: survey.question,
      answers: survey.answers.map((answer) => Object.assign({}, answer, { percent: 0, count: 0 }))
    }
  }
}
