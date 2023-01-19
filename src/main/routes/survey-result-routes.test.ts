
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { sign } from 'jsonwebtoken'
import { Collection, ObjectId } from 'mongodb'
import request from 'supertest'
import app from '../config/app'
import env from '../config/env'

let accountCollection: Collection
let surveyCollection: Collection
let surveyResultCollection: Collection

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
const makeFakeSurveyId = async (): Promise<string> => {
  const { insertedId: surveyId } = await surveyCollection.insertOne({
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
  return surveyId.toString()
}

describe('Survey Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(String(process.env.MONGO_URL))
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
    surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    await surveyResultCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  describe('GET /surveys/:surveyId/results', () => {
    test('Should return 403 on get survey result without accessToken', async () => {
      await request(app)
        .get('/api/surveys/any_id/results')
        .expect(403)
    })

    test('Should return 403 on get survey result invalid survey id provided', async () => {
      const accessToken = await makeFakeAccessToken()
      await request(app)
        .get(`/api/surveys/${new ObjectId().toString()}/results`)
        .set('x-access-token', accessToken)
        .expect(403)
    })

    test('Should return 200 on get survey result success', async () => {
      const accessToken = await makeFakeAccessToken()
      const surveyId = await makeFakeSurveyId()
      await request(app)
        .get(`/api/surveys/${surveyId.toString()}/results`)
        .set('x-access-token', accessToken)
        .send({ answer: 'Answer 1' })
        .expect(200)
    })
  })

  describe('PUT /surveys/:surveyId/results', () => {
    test('Should return 403 on save survey result without accessToken', async () => {
      await request(app)
        .put('/api/surveys/any_id/results')
        .send({ answer: 'any_answer' })
        .expect(403)
    })

    test('Should return 200 on save survey result on success', async () => {
      const accessToken = await makeFakeAccessToken()
      const surveyId = await makeFakeSurveyId()
      await request(app)
        .put(`/api/surveys/${surveyId.toString()}/results`)
        .set('x-access-token', accessToken)
        .send({ answer: 'Answer 1' })
        .expect(200)
    })
  })
})
