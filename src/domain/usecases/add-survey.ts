import { SurveyAnswerModel } from '../models/survey'

export type InsertSurveyModel = {
  question: String
  answers: SurveyAnswerModel[]
  date: Date
}

export interface AddSurvey {
  add: (survey: InsertSurveyModel) => Promise<void>
}
