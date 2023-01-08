export interface SurveyAnswer {
  image?: String
  answer: string
}

export interface InsertSurveyModel {
  question: String
  answers: SurveyAnswer[]
  date: Date
}

export interface AddSurvey {
  add: (survey: InsertSurveyModel) => Promise<void>
}
