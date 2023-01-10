import { AccountModel } from '../models/account'

export interface SearchAccountByToken {
  search: (accessToken: string, role?: string) => Promise<AccountModel | null>
}
