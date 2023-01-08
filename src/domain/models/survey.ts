export interface SurveyAnswerModel {
  image?: String
  answer: string
}
export interface SurveyModel {
  id: string
  question: string
  answers: SurveyAnswerModel[]
  date: Date
}
