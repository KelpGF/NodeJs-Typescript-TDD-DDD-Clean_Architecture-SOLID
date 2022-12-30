import { Document } from 'mongodb'
import { AddAccountRepository, FindAccountByEmailRepository, UpdateAccessTokenRepository } from '../../../../data/protocols/db/account'
import { AccountModel } from '../../../../domain/models/account'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'

export type AccountDocument = AddAccountModel & Document

export class AccountMongoRepository implements AddAccountRepository, FindAccountByEmailRepository, UpdateAccessTokenRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
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
    await accountCollection.updateOne({ _id: id }, { $set: { accessToken } })
  }
}
