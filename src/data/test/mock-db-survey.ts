import { SurveyModel } from '@/domain/models/survey'
import { AddSurveyParams } from '@/domain/usecases/survey/add-survey'
import { mockSurveyModel, mockSurveyModelList } from '@/domain/test'
import { FindSurveyByIdRepository, FindSurveysRepository, InsertSurveyRepository } from '@/data/protocols/db/survey'

export const mockInsertSurveyRepository = (): InsertSurveyRepository => {
  class InsertSurveyRepositoryStub implements InsertSurveyRepository {
    async insert (surveyData: AddSurveyParams): Promise<void> {}
  }

  return new InsertSurveyRepositoryStub()
}

export const mockFindSurveyByIdRepository = (): FindSurveyByIdRepository => {
  class FindSurveyByIdRepositoryStub implements FindSurveyByIdRepository {
    async findById (): Promise<SurveyModel> {
      return mockSurveyModel()
    }
  }

  return new FindSurveyByIdRepositoryStub()
}

export const mockFindSurveysRepository = (): FindSurveysRepository => {
  class FindSurveysRepositoryStub implements FindSurveysRepository {
    async findAll (): Promise<SurveyModel[]> {
      return mockSurveyModelList()
    }
  }

  return new FindSurveysRepositoryStub()
}
