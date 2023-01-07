import { AccountModel } from '../../../usescases/add-account/db-add-account-protocols'

export interface FindAccountByTokenRepository {
  findByToken: (token: string, role?: string) => Promise<AccountModel | null>
}
