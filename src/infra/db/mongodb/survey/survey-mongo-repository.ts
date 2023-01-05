import { InsertSurveyModel, InsertSurveyRepository } from '../../../../data/usescases/add-survey/db-add-survey-protocol'
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyMongoRepository implements InsertSurveyRepository {
  async insert (surveyData: InsertSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('survey')
    await surveyCollection.insertOne(surveyData)
  }
}
