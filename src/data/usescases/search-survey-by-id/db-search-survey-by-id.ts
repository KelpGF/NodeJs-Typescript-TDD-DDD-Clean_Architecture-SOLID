import { SurveyModel } from '../list/db-list-surveys-protocols'
import { SearchSurveyById } from '@/domain/usecases/search-survey-by-id'
import { FindSurveyByIdRepository } from '@/data/protocols/db/survey/find-survey-by-id-repository'

export class DbSearchSurveyById implements SearchSurveyById {
  constructor (
    private readonly findSurveyByIdRepository: FindSurveyByIdRepository
  ) {}

  async searchById (id: string): Promise<SurveyModel | null> {
    const survey = await this.findSurveyByIdRepository.findById(id)
    return survey
  }
}
