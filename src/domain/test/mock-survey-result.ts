import { SurveyResultModel } from '@/domain/models/survey-result'
import { SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result'

export const mockSaveSurveyResultParams = (): SaveSurveyResultParams => ({
  surveyId: 'any_survey_id',
  accountId: 'any_account_id',
  answer: 'any_answer',
  date: new Date()
})
export const mockSurveyResultModel = (): SurveyResultModel => ({
  surveyId: 'any_survey_id',
  question: 'any_survey_question',
  answers: [
    { answer: 'any_answer', image: 'any_image', count: 3, percent: 60 },
    { answer: 'other_answer', count: 2, percent: 40 }
  ],
  date: new Date()
})

export const mockEmptySurveyResultModel = (): SurveyResultModel => ({
  surveyId: 'any_survey_id',
  question: 'any_survey_question',
  answers: [
    { answer: 'any_answer', image: 'any_image', count: 0, percent: 0 },
    { answer: 'other_answer', count: 0, percent: 0 }
  ],
  date: new Date()
})
