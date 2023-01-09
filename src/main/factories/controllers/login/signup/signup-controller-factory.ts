import { makeSignUpValidation } from './signup-validation-factory'
import { makeDbAuthentication } from '@/main/factories/usecases/account/authentication/db-authentication-factory'
import { makeDbAddAccount } from '@/main/factories/usecases/account/add-account/db-add-account-factory'
import { makeLogControllerDecoratorFactory } from '@/main/factories/decorators/log-controller-decorator-factory'
import { Controller } from '@/presentation/protocols'
import { SignUpController } from '@/presentation/controller/login/signup/signup-controller'

export const makeSignUpController = (): Controller => {
  const controller = new SignUpController(makeDbAddAccount(), makeSignUpValidation(), makeDbAuthentication())
  return makeLogControllerDecoratorFactory(controller)
}
