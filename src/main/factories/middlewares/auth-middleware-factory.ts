import { makeDbFindAccountByToken } from '../usecases/account/find-account-by-token/db-find-account-by-token-factory'
import { Middleware } from '@/presentation/protocols'
import { AuthMiddleware } from '@/presentation/middlewares/auth-middleware'

export const makeAuthMiddleware = (role?: string): Middleware => {
  return new AuthMiddleware(makeDbFindAccountByToken(), role)
}
