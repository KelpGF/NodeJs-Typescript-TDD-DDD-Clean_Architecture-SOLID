import { DbListSurveys } from '../../../../../data/usescases/list/db-list-surveys'
import { ListSurveys } from '../../../../../domain/usecases/list-surveys'
import { SurveyMongoRepository } from '../../../../../infra/db/mongodb/survey/survey-mongo-repository'

export const makeDbListSurvey = (): ListSurveys => {
  const findSurveysRepository = new SurveyMongoRepository()
  return new DbListSurveys(findSurveysRepository)
}
