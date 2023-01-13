import { mockSurveyModel, mockSurveyModelList } from '@/domain/test'
import { AddSurvey, AddSurveyParams } from '@/domain/usecases/survey/add-survey'
import { ListSurveys } from '@/domain/usecases/survey/list-surveys'
import { SearchSurveyById } from '@/domain/usecases/survey/search-survey-by-id'
import { SurveyModel } from '@/domain/models/survey'

export const mockAddSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    async add (survey: AddSurveyParams): Promise<void> {}
  }
  return new AddSurveyStub()
}

export const mockListSurveys = (): ListSurveys => {
  class ListSurveyStub implements ListSurveys {
    async list (): Promise<SurveyModel[]> {
      return mockSurveyModelList()
    }
  }

  return new ListSurveyStub()
}

export const mockSearchSurveyById = (): SearchSurveyById => {
  class SearchSurveyByIdStub implements SearchSurveyById {
    async searchById (id: string): Promise<SurveyModel | null> {
      return mockSurveyModel()
    }
  }

  return new SearchSurveyByIdStub()
}
