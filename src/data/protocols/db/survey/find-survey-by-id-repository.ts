import { SurveyModel } from '@/data/usescases/list/db-list-surveys-protocols'

export interface FindSurveyByIdRepository {
  findById: (id: string) => Promise<SurveyModel>
}
