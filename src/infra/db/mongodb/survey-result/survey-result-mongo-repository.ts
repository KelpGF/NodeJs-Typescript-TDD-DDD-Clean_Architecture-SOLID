import { MongoHelper, MongoQueryBuilder } from '../helpers'
import { SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { SaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survey-result-repository'
import { ObjectId } from 'mongodb'

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save ({ accountId, surveyId, answer, date }: SaveSurveyResultParams): Promise<SurveyResultModel> {
    const surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    await surveyResultCollection.findOneAndUpdate(
      { accountId: new ObjectId(accountId), surveyId: new ObjectId(surveyId) },
      { $set: { answer, date } },
      { upsert: true }
    )

    const surveyResult = (await this.getBySurveyId(surveyId)) as SurveyResultModel
    return surveyResult
  }

  private async getBySurveyId (surveyId: string): Promise<SurveyResultModel | null> {
    const surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    const query = new MongoQueryBuilder()
      .match({ surveyId: new ObjectId(surveyId) })
      .group({
        _id: 0,
        data: { $push: '$$ROOT' },
        count: { $sum: 1 }
      })
      .unwind({ path: '$data' })
      .lookup({
        from: 'surveys',
        foreignField: '_id',
        localField: 'data.surveyId',
        as: 'survey'
      })
      .unwind({ path: '$survey' })
      .group({
        _id: {
          surveyId: '$survey._id',
          question: '$survey.question',
          date: '$survey.date',
          total: '$count',
          answer: {
            $filter: {
              input: '$survey.answers',
              as: 'item',
              cond: { $eq: ['$$item.answer', '$data.answer'] }
            }
          }
        },
        count: { $sum: 1 }
      })
      .unwind({ path: '$_id.answer' })
      .addFields({
        '_id.answer.count': '$count',
        '_id.answer.percent': {
          $multiply: [{ $divide: ['$count', '$_id.total'] }, 100]
        }
      })
      .group({
        _id: {
          surveyId: '$_id.surveyId',
          question: '$_id.question',
          date: '$_id.date'
        },
        answers: { $push: '$_id.answer' }
      })
      .project({
        _id: 0,
        surveyId: '$_id.surveyId',
        question: '$_id.question',
        date: '$_id.date',
        answers: '$answers'
      })
      .build()
    const surveyResult = await surveyResultCollection.aggregate(query).toArray()
    return surveyResult?.[0] as SurveyResultModel
  }
}
