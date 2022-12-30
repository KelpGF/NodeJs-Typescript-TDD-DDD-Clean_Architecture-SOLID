import { Collection } from 'mongodb'
import { AccountModel } from '../../../../domain/models/account'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'

let accountCollection: Collection

describe('Account Mongo Repository', () => {
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

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository()
  }
  const makeFakeAddAccountModel = (): AddAccountModel => ({
    name: 'any_name',
    email: 'any_email',
    password: 'any_password'
  })

  test('Should return an account on add success', async () => {
    const sut = makeSut()
    const fakeAddAccountModel = makeFakeAddAccountModel()
    const account = await sut.add(fakeAddAccountModel)
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe(fakeAddAccountModel.name)
    expect(account.email).toBe(fakeAddAccountModel.email)
    expect(account.password).toBe(fakeAddAccountModel.password)
  })

  test('Should return an account on find by email success', async () => {
    const fakeAddAccountModel = makeFakeAddAccountModel()
    await accountCollection.insertOne(fakeAddAccountModel)
    const sut = makeSut()
    const account = await sut.findByEmail(fakeAddAccountModel.email) as AccountModel
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.email).toBe(fakeAddAccountModel.email)
    expect(account.name).toBe(fakeAddAccountModel.name)
    expect(account.password).toBe(fakeAddAccountModel.password)
  })

  test('Should return null if find by email fails', async () => {
    const sut = makeSut()
    const account = await sut.findByEmail('any_email') as AccountModel
    expect(account).toBeFalsy()
  })

  test('Should update the account accessToken on updateAccessToken success', async () => {
    const sut = makeSut()
    const fakeAccount = await sut.add(makeFakeAddAccountModel())
    expect(fakeAccount?.accessToken).toBeFalsy()
    await sut.updateAccessToken(fakeAccount.id, 'any_token')
    const updatedAccount = await accountCollection.findOne({ _id: fakeAccount.id })
    expect(updatedAccount).toBeTruthy()
    expect(updatedAccount?.accessToken).toBe('any_token')
  })
})
