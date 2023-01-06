import { AccountModel } from '../models/account'

export interface FindAccountByToken {
  find: (accessToken: string, role?: string) => Promise<AccountModel>
}
