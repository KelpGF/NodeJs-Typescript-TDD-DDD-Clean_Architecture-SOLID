import { SurveyModel } from '../models/survey'

export interface ListSurvey {
  list: () => Promise<SurveyModel[]>
}
