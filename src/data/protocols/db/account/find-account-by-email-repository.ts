import { AccountModel } from '@/domain/models/account'

export interface FindAccountByEmailRepository {
  findByEmail: (email: string) => Promise<AccountModel | null>
}
