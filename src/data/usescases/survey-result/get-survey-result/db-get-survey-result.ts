import { FindSurveyResultBySurveyIdRepository, GetSurveyResult, SurveyResultModel } from './db-get-survey-result-protocols'

export class DbGetSurveyResult implements GetSurveyResult {
  constructor (
    private readonly findSurveyResultBySurveyIdRepository: FindSurveyResultBySurveyIdRepository
  ) {}

  async get (surveyId: string): Promise<SurveyResultModel | null> {
    const surveyResult = await this.findSurveyResultBySurveyIdRepository.findBySurveyId(surveyId)
    return surveyResult
  }
}
