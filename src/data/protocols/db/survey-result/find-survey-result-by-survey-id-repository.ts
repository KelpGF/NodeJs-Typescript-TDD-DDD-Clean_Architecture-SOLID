import { SurveyResultModel } from '@/domain/models/survey-result'

export interface FindSurveyResultBySurveyIdRepository {
  findBySurveyId: (surveyId: string) => Promise<SurveyResultModel | null>
}
