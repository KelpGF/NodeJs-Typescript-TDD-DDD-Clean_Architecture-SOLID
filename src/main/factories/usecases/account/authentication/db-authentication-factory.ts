import env from '@/main/config/env'
import { Authentication } from '@/domain/usecases/account/authentication'
import { DbAuthentication } from '@/data/usescases/account/authentication/db-authentication'
import { BcryptAdapter } from '@/infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '@/infra/cryptography/jwt-adapter/jwt-adapter'
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository'

export const makeDbAuthentication = (): Authentication => {
  const salt = 12
  const accountRepository = new AccountMongoRepository()
  const tokenGenerator = new JwtAdapter(env.jwtSecret)
  const hashComparer = new BcryptAdapter(salt)

  return new DbAuthentication(accountRepository, hashComparer, tokenGenerator, accountRepository)
}
