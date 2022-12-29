import { AccountModel } from '../usescases/add-account/db-add-account-protocols'

export interface LoadAccountByEmailRepository {
  load: (email: string) => Promise<AccountModel>
}
