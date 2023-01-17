import { SurveyResultModel, SaveSurveyResult, SaveSurveyResultParams, SaveSurveyResultRepository, FindSurveyResultBySurveyIdRepository } from './db-save-survey-result-protocols'

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor (
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository,
    private readonly findSurveyResultBySurveyIdRepository: FindSurveyResultBySurveyIdRepository
  ) {}

  async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
    await this.saveSurveyResultRepository.save(data)
    const surveyResult: SurveyResultModel = await this.findSurveyResultBySurveyIdRepository.findBySurveyId(data.surveyId) as SurveyResultModel
    return surveyResult
  }
}
