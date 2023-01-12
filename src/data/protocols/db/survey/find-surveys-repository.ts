import { SurveyModel } from '@/domain/models/survey'

export interface FindSurveysRepository {
  findAll: () => Promise<SurveyModel[]>
}
