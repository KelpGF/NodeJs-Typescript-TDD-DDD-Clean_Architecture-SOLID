import { SurveyModel } from '../models/survey'

export interface SearchSurveyById {
  searchById: (id: string) => Promise<SurveyModel | null>
}
