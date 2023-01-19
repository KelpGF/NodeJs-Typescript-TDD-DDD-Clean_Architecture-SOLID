import { DbGetSurveyResult } from '@/data/usescases/survey-result/get-survey-result/db-get-survey-result'
import { GetSurveyResult } from '@/domain/usecases/survey-result/get-survey-result'
import { SurveyResultMongoRepository } from '@/infra/db/mongodb/survey-result/survey-result-mongo-repository'
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey/survey-mongo-repository'

export const makeDbGetSurveyResult = (): GetSurveyResult => {
  const findSurveyResultBySurveyIdRepository = new SurveyResultMongoRepository()
  const findSurveyByIdRepository = new SurveyMongoRepository()
  return new DbGetSurveyResult(findSurveyResultBySurveyIdRepository, findSurveyByIdRepository)
}
