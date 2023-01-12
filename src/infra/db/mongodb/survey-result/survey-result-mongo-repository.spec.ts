import { SaveSurveyResultModel } from '@/domain/usecases/survey-result/save-survey-result'
import { Collection, ObjectId } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

const makeFakeSurveyId = async (): Promise<string> => {
  const { insertedId } = await surveyCollection.insertOne({
    question: 'any_question',
    answers: [{ answer: 'any_answer', image: 'any_image' }, { answer: 'other_answer' }],
    date: new Date()
  })
  return insertedId.toString()
}
const makeFakeAccountId = async (): Promise<string> => {
  const { insertedId } = await accountCollection.insertOne({
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'valid_pass'
  })
  return insertedId.toString()
}
const makeFakeSaveSurveyResultData = async (): Promise<SaveSurveyResultModel> => ({
  surveyId: await makeFakeSurveyId(),
  accountId: await makeFakeAccountId(),
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
      const surveyResult = await sut.save(await makeFakeSaveSurveyResultData())
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.id).toBeTruthy()
      expect(surveyResult.answer).toBe('any_answer')
    })

    test('Should update survey result if its not new', async () => {
      const accountId = await makeFakeAccountId()
      const surveyId = await makeFakeSurveyId()
      const { insertedId } = await surveyResultCollection.insertOne({
        accountId: new ObjectId(accountId),
        surveyId: new ObjectId(surveyId),
        date: new Date(),
        answer: 'other_answer'
      })
      const sut = makeSut()
      const surveyResult = await sut.save({ accountId, surveyId, date: new Date(), answer: 'any_answer' })
      expect(surveyResult).toBeTruthy()
      expect(surveyResult.id).toBe(insertedId.toString())
      expect(surveyResult.answer).toBe('any_answer')
    })
  })
})
