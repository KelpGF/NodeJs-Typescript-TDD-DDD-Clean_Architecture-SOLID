import { SurveyResultModel } from '@/domain/models/survey-result'

export interface GetSurveyResult {
  get: (surveyId: string) => Promise<SurveyResultModel | null>
}
