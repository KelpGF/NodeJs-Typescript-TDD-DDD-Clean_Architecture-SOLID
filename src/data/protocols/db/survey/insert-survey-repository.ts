import { InsertSurveyModel } from '../../../../domain/usecases/add-survey'

export interface InsertSurveyRepository {
  insert: (surveyData: InsertSurveyModel) => Promise<void>
}
