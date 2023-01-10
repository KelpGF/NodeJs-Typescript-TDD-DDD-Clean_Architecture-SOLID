import { AccountModel } from '../models/account'

export type InsertAccountModel = {
  name: string
  email: string
  password: string
}

export interface AddAccount {
  add: (account: InsertAccountModel) => Promise<AccountModel | null>
}
