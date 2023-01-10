import { AccountModel } from '@/domain/models/account'
import { AddAccountModel } from '@/domain/usecases/add-account'

export interface InsertAccountRepository {
  insert: (accountData: AddAccountModel) => Promise<AccountModel>
}
