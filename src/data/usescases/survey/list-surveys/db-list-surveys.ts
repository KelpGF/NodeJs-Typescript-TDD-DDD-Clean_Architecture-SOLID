import { FindSurveysRepository, ListSurveys, SurveyModel } from './db-list-surveys-protocols'

export class DbListSurveys implements ListSurveys {
  constructor (
    private readonly findSurveysRepository: FindSurveysRepository
  ) {}

  async list (): Promise<SurveyModel[]> {
    const surveys = await this.findSurveysRepository.findAll()
    return surveys
  }
}
