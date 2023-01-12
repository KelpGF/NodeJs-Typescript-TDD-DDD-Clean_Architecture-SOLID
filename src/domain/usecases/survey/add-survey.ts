import { SurveyModel } from '../../models/survey'

export type InsertSurveyModel = Omit<SurveyModel, 'id'>

export interface AddSurvey {
  add: (survey: InsertSurveyModel) => Promise<void>
}
