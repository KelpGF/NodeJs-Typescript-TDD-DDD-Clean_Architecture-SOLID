type SurveyResultAnswerModel = {
  image?: String
  answer: string
  count: number
  percent: number
}

export type SurveyResultModel = {
  surveyId: string
  question: string
  answers: SurveyResultAnswerModel[]
  date: Date
}
