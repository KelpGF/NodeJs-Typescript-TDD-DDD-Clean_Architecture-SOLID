import { MongoHelper } from '../helpers/mongo-helper'
import { FindSurveysRepository, SurveyModel } from '@/data/usescases/list/db-list-surveys-protocols'
import { InsertSurveyModel, InsertSurveyRepository } from '@/data/usescases/add-survey/db-add-survey-protocols'
import { FindSurveyByIdRepository } from '@/data/usescases/search-survey-by-id/db-search-survey-by-id-protocols'
import { ObjectId } from 'mongodb'

export class SurveyMongoRepository implements InsertSurveyRepository, FindSurveysRepository, FindSurveyByIdRepository {
  async insert (surveyData: InsertSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(surveyData)
  }

  async findAll (): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const surveys = await surveyCollection.find().toArray()

    return surveys.map((survey) => MongoHelper.map(survey))
  }

  async findById (id: string): Promise<SurveyModel | null> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const survey = await surveyCollection.findOne({ _id: new ObjectId(id) })
    return survey && MongoHelper.map(survey)
  }
}
