import { SurveyModel } from '@/domain/models/survey'
import { AddSurveyParams } from '@/domain/usecases/survey/add-survey'

export const mockAddSurveyParams = (): AddSurveyParams => ({
  question: 'any_question',
  answers: [{
    answer: 'any_answer',
    image: 'any_image'
  }],
  date: new Date()
})

export const mockSurveyModel = (): SurveyModel => ({
  id: 'any_survey_id',
  question: 'any_survey_question',
  answers: [{ answer: 'any_answer', image: 'any_image' }, { answer: 'other_answer' }],
  date: new Date()
})

export const mockSurveyModelList = (): SurveyModel[] => ([
  {
    id: 'any_survey_id',
    question: 'any_survey_question',
    answers: [{ answer: 'any_answer', image: 'any_image' }],
    date: new Date()
  },
  {
    id: 'other_survey_id',
    question: 'other_question',
    answers: [{ answer: 'other_answer' }],
    date: new Date()
  }
])
