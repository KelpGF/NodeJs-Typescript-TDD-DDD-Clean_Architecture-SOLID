import { Document, ObjectId } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountModel } from '@/domain/models/account'
import { AddAccountModel } from '@/domain/usecases/add-account'
import { InsertAccountRepository, FindAccountByEmailRepository, UpdateAccessTokenRepository, FindAccountByTokenRepository } from '@/data/protocols/db/account'

export type AccountDocument = AddAccountModel & Document

export class AccountMongoRepository
implements
  InsertAccountRepository,
  FindAccountByEmailRepository,
  UpdateAccessTokenRepository,
  FindAccountByTokenRepository {
  async insert (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const { insertedId } = await accountCollection.insertOne(accountData)
    const account: AccountDocument = await accountCollection.findOne<AccountDocument>({ _id: insertedId }) as AccountDocument

    return MongoHelper.map(account)
  }

  async findByEmail (email: string): Promise<AccountModel | null> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account: AccountDocument = await accountCollection.findOne<AccountDocument>({ email }) as AccountDocument
    return account && MongoHelper.map(account)
  }

  async updateAccessToken (id: string, accessToken: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.updateOne({ _id: new ObjectId(id) }, { $set: { accessToken } })
  }

  async findByToken (token: string, role?: string): Promise<AccountModel | null> {
    const query = {
      accessToken: token,
      role: { $in: [role, 'admin'] }
    }
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account: AccountDocument = await accountCollection.findOne<AccountDocument>(query) as AccountDocument
    return account && MongoHelper.map(account)
  }
}
