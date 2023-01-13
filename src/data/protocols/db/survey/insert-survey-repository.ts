import { InsertSurveyParams } from '@/domain/usecases/survey/add-survey'

export interface InsertSurveyRepository {
  insert: (surveyData: InsertSurveyParams) => Promise<void>
}
