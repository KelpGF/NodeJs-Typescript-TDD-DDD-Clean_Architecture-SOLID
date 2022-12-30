import { hash } from 'bcrypt'
import { Collection } from 'mongodb'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'

let accountCollection: Collection

describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(String(process.env.MONGO_URL))
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  describe('POST /signup', () => {
    test('Should return 200 on signup', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'any_name',
          email: 'any_mail@mail.com',
          password: 'any_pass',
          passwordConfirmation: 'any_pass'
        })
        .expect(200)
    })
  })

  describe('POST /login', () => {
    test('Should return 200 on login', async () => {
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_mail@mail.com',
        password: await hash('any_pass', 12)
      })
      await request(app)
        .post('/api/login')
        .send({
          email: 'any_mail@mail.com',
          password: 'any_pass'
        })
        .expect(200)
    })
  })
})
