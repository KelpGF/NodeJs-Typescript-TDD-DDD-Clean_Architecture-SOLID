import { AccountModel } from '@/domain/models/account'
import { InsertAccountModel } from '@/domain/usecases/add-account'

export interface InsertAccountRepository {
  insert: (accountData: InsertAccountModel) => Promise<AccountModel>
}
