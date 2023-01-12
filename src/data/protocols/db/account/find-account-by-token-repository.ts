import { AccountModel } from '@/domain/models/account'

export interface FindAccountByTokenRepository {
  findByToken: (token: string, role?: string) => Promise<AccountModel | null>
}
