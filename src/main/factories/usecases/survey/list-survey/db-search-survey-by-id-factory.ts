import { SearchSurveyById } from '@/domain/usecases/survey/search-survey-by-id'
import { DbSearchSurveyById } from '@/data/usescases/survey/search-survey-by-id/db-search-survey-by-id'
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey/survey-mongo-repository'

export const makeDbSearchSurveyById = (): SearchSurveyById => {
  const findSurveyByIdRepository = new SurveyMongoRepository()
  return new DbSearchSurveyById(findSurveyByIdRepository)
}
