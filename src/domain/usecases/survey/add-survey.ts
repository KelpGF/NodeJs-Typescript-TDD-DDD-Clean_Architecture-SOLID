import { SurveyModel } from '@/domain/models/survey'

export type InsertSurveyModel = Omit<SurveyModel, 'id'>

export interface AddSurvey {
  add: (survey: InsertSurveyModel) => Promise<void>
}
