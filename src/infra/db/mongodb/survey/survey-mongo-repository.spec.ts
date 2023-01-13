import { Collection } from 'mongodb'
import { SurveyMongoRepository } from './survey-mongo-repository'
import { MongoHelper } from '../helpers/mongo-helper'
import { mockAddSurveyParams } from '@/domain/test'

let surveyCollection: Collection

const makeSut = (): SurveyMongoRepository => new SurveyMongoRepository()

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
      await sut.insert(mockAddSurveyParams())
      const survey = await surveyCollection.findOne({ question: 'any_question' })
      expect(survey).toBeTruthy()
    })
  })

  describe('findAll()', () => {
    test('Should find all on success', async () => {
      await surveyCollection.insertMany([
        mockAddSurveyParams(),
        { ...mockAddSurveyParams(), question: 'other_question' }
      ])
      const sut = makeSut()
      const surveys = await sut.findAll()
      expect(surveys.length).toBe(2)
      expect(surveys[0].id).toBeTruthy()
      expect(surveys[0].question).toBe('any_question')
      expect(surveys[1].question).toBe('other_question')
    })

    test('Should find empty list', async () => {
      const sut = makeSut()
      const surveys = await sut.findAll()
      expect(surveys.length).toBe(0)
    })
  })

  describe('findById()', () => {
    test('Should findById on success', async () => {
      const { insertedId } = await surveyCollection.insertOne(mockAddSurveyParams())
      const sut = makeSut()
      const survey = await sut.findById(insertedId.toString())
      expect(survey).toBeTruthy()
      expect(survey?.id).toBeTruthy()
    })
  })
})
