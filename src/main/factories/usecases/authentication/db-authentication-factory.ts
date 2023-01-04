import { DbAuthentication } from '../../../../data/usescases/authentication/db-authentication'
import { Authentication } from '../../../../domain/usecases/authentication'
import { BcryptAdapter } from '../../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '../../../../infra/cryptography/jwt-adapter/jwt-adapter'
import { AccountMongoRepository } from '../../../../infra/db/mongodb/account/account-mongo-repository'
import env from '../../../config/env'

export const makeDbAuthentication = (): Authentication => {
  const salt = 12
  const accountRepository = new AccountMongoRepository()
  const tokenGenerator = new JwtAdapter(env.jwtSecret)
  const hashComparer = new BcryptAdapter(salt)

  return new DbAuthentication(accountRepository, hashComparer, tokenGenerator, accountRepository)
}
