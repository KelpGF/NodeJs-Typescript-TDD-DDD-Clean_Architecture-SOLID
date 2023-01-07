
import { Collection } from 'mongodb'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'
import { InsertSurveyModel } from '../../domain/usecases/add-survey'

let surveyCollection: Collection

const makeFakeAddSurvey = (): InsertSurveyModel => ({
  question: 'Question',
  answers: [
    {
      answer: 'Answer 1',
      image: 'http://image-name.com'
    },
    {
      answer: 'Answer 2'
    }
  ]
})

describe('Survey Routes', () => {
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

  describe('POST /surveys', () => {
    test('Should return 403 on add survey without accessToken', async () => {
      await request(app)
        .post('/api/surveys')
        .send(makeFakeAddSurvey())
        .expect(403)
    })
  })
})
