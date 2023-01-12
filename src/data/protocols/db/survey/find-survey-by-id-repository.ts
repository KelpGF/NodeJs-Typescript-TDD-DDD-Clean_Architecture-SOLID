import { SurveyModel } from '@/domain/models/survey'

export interface FindSurveyByIdRepository {
  findById: (id: string) => Promise<SurveyModel | null>
}
