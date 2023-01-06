import { InsertSurveyModel, InsertSurveyRepository } from '../../../../data/usescases/add-survey/db-add-survey-protocols'
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyMongoRepository implements InsertSurveyRepository {
  async insert (surveyData: InsertSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(surveyData)
  }
}
