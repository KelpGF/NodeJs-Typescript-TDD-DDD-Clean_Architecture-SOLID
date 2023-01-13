import { AccountModel } from '@/domain/models/account'
import { AddAccountParams } from '@/domain/usecases/account/add-account'

export interface InsertAccountRepository {
  insert: (accountData: AddAccountParams) => Promise<AccountModel>
}
