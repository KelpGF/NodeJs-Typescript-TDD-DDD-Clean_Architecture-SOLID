import { mockAddAccountParams, mockAddSurveyParams } from '@/domain/test'
import { SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result'
import { Collection, ObjectId } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

const mockSurveyId = async (): Promise<string> => {
  const { insertedId } = await surveyCollection.insertOne(mockAddSurveyParams())
  return insertedId.toString()
}
const mockAccountModelId = async (): Promise<string> => {
  const { insertedId } = await accountCollection.insertOne(mockAddAccountParams())
  return insertedId.toString()
}
const mockSaveSurveyResultModel = async (): Promise<SaveSurveyResultParams> => ({
  surveyId: await mockSurveyId(),
  accountId: await mockAccountModelId(),
  answer: 'any_answer',
  date: new Date()
})

const makeSut = (): SurveyResultMongoRepository => new SurveyResultMongoRepository()

describe('SurveyResult MongoRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(String(process.env.MONGO_URL))
  })
  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    await surveyResultCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  describe('save()', () => {
    test('Should add a survey result if its new', async () => {
      const sut = makeSut()
      const saveSurveyResultModel = await mockSaveSurveyResultModel()
      const surveyResult = await sut.save(saveSurveyResultModel)
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.answers[0].count).toBe(1)
      expect(surveyResult.answers[0].percent).toBe(100)
      expect(surveyResult.answers[0].answer).toBe('any_answer')
    })

    test('Should update survey result if its not new', async () => {
      const accountId = await mockAccountModelId()
      const surveyId = await mockSurveyId()
      await surveyResultCollection.insertOne({
        accountId: new ObjectId(accountId),
        surveyId: new ObjectId(surveyId),
        date: new Date(),
        answer: 'any_answer'
      })
      const sut = makeSut()
      const surveyResult = await sut.save({ accountId, surveyId, date: new Date(), answer: 'other_answer' })
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.answers[0].answer).toBe('other_answer')
      expect(surveyResult.answers[0].count).toBe(1)
      expect(surveyResult.answers[0].percent).toBe(100)
    })
  })
})
