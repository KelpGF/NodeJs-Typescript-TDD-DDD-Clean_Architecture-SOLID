
import request from 'supertest'
import { Collection } from 'mongodb'
import { sign } from 'jsonwebtoken'
import app from '../config/app'
import env from '../config/env'
import { InsertSurveyModel } from '@/domain/usecases/add-survey'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'

let surveyCollection: Collection
let accountCollection: Collection

const makeFakeAccessToken = async (role?: string): Promise<string> => {
  const { insertedId } = await accountCollection.insertOne({
    name: 'any_name',
    email: 'any_mail@mail.com',
    password: 'any_pass',
    role
  })
  const accessToken = sign({ id: insertedId }, env.jwtSecret)
  await accountCollection.updateOne({ _id: insertedId }, { $set: { accessToken } })
  return accessToken
}

const makeFakeAddSurvey = (): Omit<InsertSurveyModel, 'date'> => ({
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
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
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

    test('Should return 204 on add survey if valid token is provided', async () => {
      const accessToken = await makeFakeAccessToken('admin')
      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send(makeFakeAddSurvey())
        .expect(204)
    })
  })

  describe('GET /surveys', () => {
    test('Should return 403 on list survey without accessToken', async () => {
      await request(app)
        .get('/api/surveys')
        .expect(403)
    })

    test('Should return 204 on list survey if valid token is provided', async () => {
      const accessToken = await makeFakeAccessToken()

      await request(app)
        .get('/api/surveys')
        .set('x-access-token', accessToken)
        .expect(204)
    })
  })
})
