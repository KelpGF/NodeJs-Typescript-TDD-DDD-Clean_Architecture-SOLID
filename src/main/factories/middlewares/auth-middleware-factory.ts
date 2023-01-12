import { makeDbSearchAccountByToken } from '@/main/factories/usecases/account/search-account-by-token/db-search-account-by-token-factory'
import { Middleware } from '@/presentation/protocols'
import { AuthMiddleware } from '@/presentation/middlewares/auth-middleware'

export const makeAuthMiddleware = (role?: string): Middleware => {
  return new AuthMiddleware(makeDbSearchAccountByToken(), role)
}
