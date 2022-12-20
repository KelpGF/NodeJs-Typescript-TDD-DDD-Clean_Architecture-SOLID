import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(String(process.env.MONGO_URL))
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('Should return an account on success', async () => {
    const sut = new AccountMongoRepository()
    const mockAccount = {
      name: 'any_name',
      email: 'any_email',
      password: 'any_password'
    }
    const account = await sut.add(mockAccount)
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe(mockAccount.name)
    expect(account.email).toBe(mockAccount.email)
    expect(account.password).toBe(mockAccount.password)
  })
})
