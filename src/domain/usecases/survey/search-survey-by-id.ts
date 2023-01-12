import { SurveyModel } from '@/domain/models/survey'

export interface SearchSurveyById {
  searchById: (id: string) => Promise<SurveyModel | null>
}
