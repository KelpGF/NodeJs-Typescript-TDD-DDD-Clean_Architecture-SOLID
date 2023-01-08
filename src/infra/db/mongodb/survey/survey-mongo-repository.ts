import { InsertSurveyModel, InsertSurveyRepository } from '../../../../data/usescases/add-survey/db-add-survey-protocols'
import { FindSurveysRepository, SurveyModel } from '../../../../data/usescases/list/db-list-surveys-protocols'
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyMongoRepository implements InsertSurveyRepository, FindSurveysRepository {
  async insert (surveyData: InsertSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(surveyData)
  }

  async findAll (): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const surveys = await surveyCollection.find().toArray()

    return surveys.map((survey) => MongoHelper.map(survey))
  }
}
