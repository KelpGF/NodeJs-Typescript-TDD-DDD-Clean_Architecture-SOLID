import { Document } from 'mongodb'
import { AddAccountRepository } from '../../../../data/protocols/add-account-repository'
import { AccountModel } from '../../../../domain/models/account'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'

export type AccountDocument = AddAccountModel & Document

export class AccountMongoRepository implements AddAccountRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const { insertedId } = await accountCollection.insertOne(accountData)
    const account: AccountDocument = await accountCollection.findOne<AccountDocument>({ _id: insertedId }) as AccountDocument

    return MongoHelper.map(account)
  }
}
