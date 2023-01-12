import { SurveyModel } from '@/domain/models/survey'

export interface ListSurveys {
  list: () => Promise<SurveyModel[]>
}
