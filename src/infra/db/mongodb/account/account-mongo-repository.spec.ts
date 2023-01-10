import { Collection } from 'mongodb'
import { AccountMongoRepository } from './account-mongo-repository'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountModel } from '@/domain/models/account'
import { AddAccountModel } from '@/domain/usecases/add-account'

let accountCollection: Collection

const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository()
}
const makeFakeAddAccountModel = (): AddAccountModel => ({
  name: 'any_name',
  email: 'any_email',
  password: 'any_password'
})

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

  describe('insert()', () => {
    test('Should return an account on insert success', async () => {
      const sut = makeSut()
      const fakeAddAccountModel = makeFakeAddAccountModel()
      const account = await sut.insert(fakeAddAccountModel)
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe(fakeAddAccountModel.name)
      expect(account.email).toBe(fakeAddAccountModel.email)
      expect(account.password).toBe(fakeAddAccountModel.password)
    })
  })

  describe('findByEmail()', () => {
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
  })

  describe('updateAccessToken()', () => {
    test('Should update the account accessToken on updateAccessToken success', async () => {
      const sut = makeSut()
      const fakeAccount = await sut.insert(makeFakeAddAccountModel())
      expect(fakeAccount?.accessToken).toBeFalsy()
      await sut.updateAccessToken(fakeAccount.id, 'any_token')
      const updatedAccount = await accountCollection.findOne({ _id: fakeAccount.id })
      expect(updatedAccount).toBeTruthy()
      expect(updatedAccount?.accessToken).toBe('any_token')
    })
  })

  describe('findByToken()', () => {
    test('Should return an account on findByToken without role', async () => {
      const fakeAddAccountModel = makeFakeAddAccountModel()
      await accountCollection.insertOne({ ...fakeAddAccountModel, accessToken: 'any_token' })
      const sut = makeSut()
      const account = await sut.findByToken('any_token') as AccountModel
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.email).toBe(fakeAddAccountModel.email)
      expect(account.name).toBe(fakeAddAccountModel.name)
      expect(account.password).toBe(fakeAddAccountModel.password)
    })

    test('Should return an account on findByToken with admin role', async () => {
      const fakeAddAccountModel = makeFakeAddAccountModel()
      await accountCollection.insertOne({ ...fakeAddAccountModel, accessToken: 'any_token', role: 'admin' })
      const sut = makeSut()
      const account = await sut.findByToken('any_token', 'admin') as AccountModel
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.email).toBe(fakeAddAccountModel.email)
      expect(account.name).toBe(fakeAddAccountModel.name)
      expect(account.password).toBe(fakeAddAccountModel.password)
    })

    test('Should return null on findByToken with invalid role', async () => {
      const fakeAddAccountModel = makeFakeAddAccountModel()
      await accountCollection.insertOne({ ...fakeAddAccountModel, accessToken: 'any_token' })
      const sut = makeSut()
      const account = await sut.findByToken('any_token', 'admin') as AccountModel
      expect(account).toBeFalsy()
    })

    test('Should return an account on findByToken if user is admin', async () => {
      const fakeAddAccountModel = makeFakeAddAccountModel()
      await accountCollection.insertOne({ ...fakeAddAccountModel, accessToken: 'any_token', role: 'admin' })
      const sut = makeSut()
      const account = await sut.findByToken('any_token') as AccountModel
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.email).toBe(fakeAddAccountModel.email)
      expect(account.name).toBe(fakeAddAccountModel.name)
      expect(account.password).toBe(fakeAddAccountModel.password)
    })

    test('Should return null if findByToken fails', async () => {
      const sut = makeSut()
      const account = await sut.findByEmail('any_email') as AccountModel
      expect(account).toBeFalsy()
    })
  })
})
