import { DbAuthentication } from '../../../data/usescases/authentication/db-authentication'
import { BcryptAdapter } from '../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '../../../infra/cryptography/jwt-adapter/jwt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository'
import { LoginController } from '../../../presentation/controller/login/login-controller'
import { Controller } from '../../../presentation/protocols'
import env from '../../config/env'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'
import { makeLoginValidation } from './login-validation-factory'

export const makeLoginController = (): Controller => {
  const salt = 12
  const accountRepository = new AccountMongoRepository()
  const logRepository = new LogMongoRepository()
  const tokenGenerator = new JwtAdapter(env.jwtSecret)
  const hashComparer = new BcryptAdapter(salt)
  const authentication = new DbAuthentication(accountRepository, hashComparer, tokenGenerator, accountRepository)
  const loginController = new LoginController(authentication, makeLoginValidation())

  return new LogControllerDecorator(loginController, logRepository)
}
