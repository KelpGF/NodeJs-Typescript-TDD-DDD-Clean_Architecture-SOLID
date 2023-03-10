import { SurveyResultModel } from '@/domain/models/survey-result'
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
      await sut.save(saveSurveyResultModel)
      const surveyResult = await surveyResultCollection.findOne({
        surveyId: new ObjectId(saveSurveyResultModel.surveyId),
        accountId: new ObjectId(saveSurveyResultModel.accountId)
      })
      expect(surveyResult).toBeTruthy()
      expect(surveyResult?.answer).toBe('any_answer')
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
      await sut.save({ accountId, surveyId, date: new Date(), answer: 'other_answer' })
      const surveyResults = await surveyResultCollection.find({
        surveyId: new ObjectId(surveyId),
        accountId: new ObjectId(accountId)
      }).toArray()
      expect(surveyResults.length).toBe(1)
      expect(surveyResults[0].answer).toBe('other_answer')
    })
  })

  describe('findBySurveyId()', () => {
    test('Should return a surveyResult if valid surveyId is provided', async () => {
      const sut = makeSut()
      const accountId = await mockAccountModelId()
      const surveyId = await mockSurveyId()
      await surveyResultCollection.insertMany([
        {
          accountId: new ObjectId(accountId),
          surveyId: new ObjectId(surveyId),
          date: new Date(),
          answer: 'any_answer'
        },
        {
          accountId: new ObjectId(accountId),
          surveyId: new ObjectId(surveyId),
          date: new Date(),
          answer: 'any_answer'
        },
        {
          accountId: new ObjectId(accountId),
          surveyId: new ObjectId(surveyId),
          date: new Date(),
          answer: 'any_answer'
        },
        {
          accountId: new ObjectId(accountId),
          surveyId: new ObjectId(surveyId),
          date: new Date(),
          answer: 'other_answer'
        }
      ])

      const surveyResult: SurveyResultModel = (await sut.findBySurveyId(surveyId)) as SurveyResultModel
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.answers[0].count).toBe(3)
      expect(surveyResult.answers[0].percent).toBe(75)
      expect(surveyResult.answers[0].answer).toBe('any_answer')
      expect(surveyResult.answers[1].count).toBe(1)
      expect(surveyResult.answers[1].percent).toBe(25)
      expect(surveyResult.answers[1].answer).toBe('other_answer')
    })

    test('Should return null if invalid surveyId is provided', async () => {
      const sut = makeSut()
      const surveyResult = await sut.findBySurveyId(new ObjectId().toString())
      expect(surveyResult).toBeNull()
    })
  })
})
