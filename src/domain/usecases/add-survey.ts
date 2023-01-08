import { SurveyAnswerModel } from '../models/survey'

export interface InsertSurveyModel {
  question: String
  answers: SurveyAnswerModel[]
  date: Date
}

export interface AddSurvey {
  add: (survey: InsertSurveyModel) => Promise<void>
}
