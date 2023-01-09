import { AccountModel } from '@/data/usescases/add-account/db-add-account-protocols'

export interface FindAccountByEmailRepository {
  findByEmail: (email: string) => Promise<AccountModel | null>
}
