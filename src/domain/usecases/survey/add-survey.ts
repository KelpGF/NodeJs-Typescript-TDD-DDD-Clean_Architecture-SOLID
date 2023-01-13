import { SurveyModel } from '@/domain/models/survey'

export type InsertSurveyParams = Omit<SurveyModel, 'id'>

export interface AddSurvey {
  add: (survey: InsertSurveyParams) => Promise<void>
}
