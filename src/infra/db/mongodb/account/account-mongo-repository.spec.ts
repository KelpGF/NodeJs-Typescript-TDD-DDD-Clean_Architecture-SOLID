import { Collection, ObjectId } from 'mongodb'
import { AccountMongoRepository } from './account-mongo-repository'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountModel } from '@/domain/models/account'
import { mockAddAccountParams, mockAddAccountParamsWithToken, mockAddAccountParamsWithTokenAndRole } from '@/domain/test'

let accountCollection: Collection

const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository()
}

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
      const fakeAddAccountParams = mockAddAccountParams()
      const account = await sut.insert(fakeAddAccountParams)
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.name).toBe(fakeAddAccountParams.name)
      expect(account.email).toBe(fakeAddAccountParams.email)
      expect(account.password).toBe(fakeAddAccountParams.password)
    })
  })

  describe('findByEmail()', () => {
    test('Should return an account on find by email success', async () => {
      const fakeAddAccountParams = mockAddAccountParams()
      await accountCollection.insertOne(fakeAddAccountParams)
      const sut = makeSut()
      const account = await sut.findByEmail(fakeAddAccountParams.email) as AccountModel
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.email).toBe(fakeAddAccountParams.email)
      expect(account.name).toBe(fakeAddAccountParams.name)
      expect(account.password).toBe(fakeAddAccountParams.password)
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
      const fakeAccount = await sut.insert(mockAddAccountParams())
      expect(fakeAccount?.accessToken).toBeFalsy()
      await sut.updateAccessToken(fakeAccount.id, 'any_token')
      const updatedAccount = await accountCollection.findOne({ _id: new ObjectId(fakeAccount.id) })
      expect(updatedAccount).toBeTruthy()
      expect(updatedAccount?.accessToken).toBe('any_token')
    })
  })

  describe('findByToken()', () => {
    test('Should return an account on findByToken without role', async () => {
      const fakeAddAccountParams = mockAddAccountParamsWithToken()
      await accountCollection.insertOne(fakeAddAccountParams)
      const sut = makeSut()
      const account = await sut.findByToken('any_token') as AccountModel
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.email).toBe(fakeAddAccountParams.email)
      expect(account.name).toBe(fakeAddAccountParams.name)
      expect(account.password).toBe(fakeAddAccountParams.password)
    })

    test('Should return an account on findByToken with admin role', async () => {
      const fakeAddAccountParams = mockAddAccountParamsWithTokenAndRole('admin')
      await accountCollection.insertOne(fakeAddAccountParams)
      const sut = makeSut()
      const account = await sut.findByToken('any_token', 'admin') as AccountModel
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.email).toBe(fakeAddAccountParams.email)
      expect(account.name).toBe(fakeAddAccountParams.name)
      expect(account.password).toBe(fakeAddAccountParams.password)
    })

    test('Should return null on findByToken with invalid role', async () => {
      await accountCollection.insertOne(mockAddAccountParamsWithToken())
      const sut = makeSut()
      const account = await sut.findByToken('any_token', 'admin') as AccountModel
      expect(account).toBeFalsy()
    })

    test('Should return an account on findByToken if user is admin', async () => {
      const fakeAddAccountParams = mockAddAccountParamsWithTokenAndRole('admin')
      await accountCollection.insertOne(fakeAddAccountParams)
      const sut = makeSut()
      const account = await sut.findByToken('any_token') as AccountModel
      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy()
      expect(account.email).toBe(fakeAddAccountParams.email)
      expect(account.name).toBe(fakeAddAccountParams.name)
      expect(account.password).toBe(fakeAddAccountParams.password)
    })

    test('Should return null if findByToken fails', async () => {
      const sut = makeSut()
      const account = await sut.findByEmail('any_email') as AccountModel
      expect(account).toBeFalsy()
    })
  })
})
