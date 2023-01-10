import env from '@/main/config/env'
import { DbSearchAccountByToken } from '@/data/usescases/find-account-by-token/db-search-account-by-token'
import { SearchAccountByToken } from '@/domain/usecases/search-account-by-token'
import { JwtAdapter } from '@/infra/cryptography/jwt-adapter/jwt-adapter'
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository'

export const makeDbSearchAccountByToken = (): SearchAccountByToken => {
  const decrypter = new JwtAdapter(env.jwtSecret)
  const findAccountByTokenRepository = new AccountMongoRepository()
  return new DbSearchAccountByToken(decrypter, findAccountByTokenRepository)
}
