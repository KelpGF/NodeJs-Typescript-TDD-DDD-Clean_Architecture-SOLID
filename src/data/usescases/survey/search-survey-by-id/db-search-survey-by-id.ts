import { SurveyModel, SearchSurveyById, FindSurveyByIdRepository } from './db-search-survey-by-id-protocols'

export class DbSearchSurveyById implements SearchSurveyById {
  constructor (
    private readonly findSurveyByIdRepository: FindSurveyByIdRepository
  ) {}

  async searchById (id: string): Promise<SurveyModel | null> {
    const survey = await this.findSurveyByIdRepository.findById(id)
    return survey
  }
}
