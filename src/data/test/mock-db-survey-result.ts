import { SurveyResultModel } from '@/domain/models/survey-result'
import { SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result'
import { mockSurveyResultModel } from '@/domain/test'
import { SaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survey-result-repository'
import { FindSurveyResultBySurveyIdRepository } from '@/data/protocols/db/survey-result/find-survey-result-by-survey-id-repository'

export const mockSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save (surveyResult: SaveSurveyResultParams): Promise<void> {}
  }

  return new SaveSurveyResultRepositoryStub()
}

export const mockFindSurveyResultBySurveyIdRepository = (): FindSurveyResultBySurveyIdRepository => {
  class FindSurveyResultBySurveyIdRepositoryStub implements FindSurveyResultBySurveyIdRepository {
    async findBySurveyId (surveyId: string): Promise<SurveyResultModel> {
      return mockSurveyResultModel()
    }
  }

  return new FindSurveyResultBySurveyIdRepositoryStub()
}
