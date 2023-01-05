import { AccountModel } from '../models/account'

export interface InsertAccountModel {
  name: string
  email: string
  password: string
}

export interface AddAccount {
  add: (account: InsertAccountModel) => Promise<AccountModel | null>
}
