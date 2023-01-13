import { AddSurveyParams } from '@/domain/usecases/survey/add-survey'

export interface InsertSurveyRepository {
  insert: (surveyData: AddSurveyParams) => Promise<void>
}
