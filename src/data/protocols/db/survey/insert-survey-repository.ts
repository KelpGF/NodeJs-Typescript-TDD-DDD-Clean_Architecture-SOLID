import { InsertSurveyModel } from '@/domain/usecases/survey/add-survey'

export interface InsertSurveyRepository {
  insert: (surveyData: InsertSurveyModel) => Promise<void>
}
