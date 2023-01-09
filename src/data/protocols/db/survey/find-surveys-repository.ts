import { SurveyModel } from '@/data/usescases/list/db-list-surveys-protocols'

export interface FindSurveysRepository {
  findAll: () => Promise<SurveyModel[]>
}
