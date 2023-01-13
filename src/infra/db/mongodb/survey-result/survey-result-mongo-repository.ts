import { MongoHelper } from '../helpers/mongo-helper'
import { SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { SaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survey-result-repository'
import { ObjectId } from 'mongodb'

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save ({ accountId, surveyId, answer, date }: SaveSurveyResultParams): Promise<SurveyResultModel> {
    const surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    const { value: surveyResultData } = await surveyResultCollection.findOneAndUpdate(
      { accountId: new ObjectId(accountId), surveyId: new ObjectId(surveyId) },
      { $set: { answer, date } },
      { upsert: true, returnDocument: 'after' }
    )
    return Object.assign({}, MongoHelper.map(surveyResultData), { accountId, surveyId })
  }
}
