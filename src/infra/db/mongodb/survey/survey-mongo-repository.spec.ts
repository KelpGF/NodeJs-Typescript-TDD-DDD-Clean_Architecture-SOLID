import { Collection } from 'mongodb'
import { InsertSurveyModel } from '../../../../domain/usecases/add-survey'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'

let surveyCollection: Collection

const makeSut = (): SurveyMongoRepository => new SurveyMongoRepository()
const makeSurveyData = (): InsertSurveyModel => ({
  question: 'any_question',
  answers: [
    {
      answer: 'any_answer',
      image: 'any_image'
    },
    {
      answer: 'other_any_answer'
    }
  ],
  date: new Date()
})

describe('Survey MongoRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(String(process.env.MONGO_URL))
  })
  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  describe('add()', () => {
    test('Should insert a survey on insert success', async () => {
      const sut = makeSut()
      await sut.insert(makeSurveyData())
      const survey = await surveyCollection.findOne({ question: 'any_question' })
      expect(survey).toBeTruthy()
    })
  })

  describe('findAll()', () => {
    test('Should find all on success', async () => {
      await surveyCollection.insertMany([
        makeSurveyData(),
        { ...makeSurveyData(), question: 'other_question' }
      ])
      const sut = makeSut()
      const surveys = await sut.findAll()
      expect(surveys.length).toBe(2)
      expect(surveys[0].question).toBe('any_question')
      expect(surveys[1].question).toBe('other_question')
    })
  })

  test('Should find empty list', async () => {
    const sut = makeSut()
    const surveys = await sut.findAll()
    expect(surveys.length).toBe(0)
  })
})
