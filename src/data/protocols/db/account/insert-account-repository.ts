import { AccountModel } from '@/domain/models/account'
import { AddAccountModel } from '@/domain/usecases/account/add-account'

export interface InsertAccountRepository {
  insert: (accountData: AddAccountModel) => Promise<AccountModel>
}
