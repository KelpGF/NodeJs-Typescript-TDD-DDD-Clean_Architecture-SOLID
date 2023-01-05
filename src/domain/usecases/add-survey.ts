export interface SurveyAnswer {
  image: String
  answer: string
}

export interface InsertSurveyModel {
  question: String
  answers: SurveyAnswer[]
}

export interface AddSurvey {
  add: (account: InsertSurveyModel) => Promise<void>
}
