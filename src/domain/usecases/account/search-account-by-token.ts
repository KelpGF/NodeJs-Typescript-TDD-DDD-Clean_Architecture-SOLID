import { AccountModel } from '@/domain/models/account'

export interface SearchAccountByToken {
  search: (accessToken: string, role?: string) => Promise<AccountModel | null>
}
