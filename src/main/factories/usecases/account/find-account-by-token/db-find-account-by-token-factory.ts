import env from '@/main/config/env'
import { DbFindAccountByToken } from '@/data/usescases/find-account-by-token/db-find-account-by-token'
import { FindAccountByToken } from '@/domain/usecases/find-account-by-token'
import { JwtAdapter } from '@/infra/cryptography/jwt-adapter/jwt-adapter'
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository'

export const makeDbFindAccountByToken = (): FindAccountByToken => {
  const decrypter = new JwtAdapter(env.jwtSecret)
  const findAccountByTokenRepository = new AccountMongoRepository()
  return new DbFindAccountByToken(decrypter, findAccountByTokenRepository)
}
