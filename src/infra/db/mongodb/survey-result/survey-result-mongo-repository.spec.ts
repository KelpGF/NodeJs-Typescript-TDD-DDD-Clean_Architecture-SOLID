import { SaveSurveyResultModel } from '@/domain/usecases/save-survey-result'
import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

const makeFakeSurveyId = async (): Promise<string> => {
  const { insertedId } = await surveyCollection.insertOne({
    question: 'any_question',
    answers: [{ answer: 'any_answer', image: 'any_image' }],
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
  })
})
