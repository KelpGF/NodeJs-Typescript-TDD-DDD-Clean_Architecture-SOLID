import { AddAccount } from '@/domain/usecases/account/add-account'
import { DBAddAccount } from '@/data/usescases/account/add-account/db-add-account'
import { BcryptAdapter } from '@/infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository'

export const makeDbAddAccount = (): AddAccount => {
  const salt = 12
  const hasher = new BcryptAdapter(salt)
  const accountRepository = new AccountMongoRepository()
  return new DBAddAccount(hasher, accountRepository, accountRepository)
}
