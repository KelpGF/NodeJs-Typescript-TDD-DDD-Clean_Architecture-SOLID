
import { makeLogControllerDecoratorFactory } from '@/main/factories/decorators/log-controller-decorator-factory'
import { makeDbAuthentication } from '@/main/factories/usecases/account/authentication/db-authentication-factory'
import { makeLoginValidation } from './login-validation-factory'
import { Controller } from '@/presentation/protocols'
import { LoginController } from '@/presentation/controller/login/login/login-controller'

export const makeLoginController = (): Controller => {
  const controller = new LoginController(makeDbAuthentication(), makeLoginValidation())
  return makeLogControllerDecoratorFactory(controller)
}
