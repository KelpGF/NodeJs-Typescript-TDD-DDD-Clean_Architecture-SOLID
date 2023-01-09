import { DbAddSurvey } from '../../../../../data/usescases/add-survey/db-add-survey'
import { AddSurvey } from '../../../../../domain/usecases/add-survey'
import { SurveyMongoRepository } from '../../../../../infra/db/mongodb/survey/survey-mongo-repository'

export const makeDbAddSurvey = (): AddSurvey => {
  const insertSurveyRepository = new SurveyMongoRepository()
  return new DbAddSurvey(insertSurveyRepository)
}
