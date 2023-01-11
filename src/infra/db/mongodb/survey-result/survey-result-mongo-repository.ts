import { SaveSurveyResultModel, SaveSurveyResultRepository, SurveyResultModel } from '@/data/usescases/save-survey-result/db-save-survey-result-protocols'
import { ObjectId } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save ({ accountId, surveyId, answer, date }: SaveSurveyResultModel): Promise<SurveyResultModel> {
    const surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    const { value: surveyResultData } = await surveyResultCollection.findOneAndUpdate(
      { accountId: new ObjectId(accountId), surveyId: new ObjectId(surveyId) },
      { $set: { answer, date } },
      { upsert: true, returnDocument: 'after' }
    )
    return MongoHelper.map(surveyResultData)
  }
}
