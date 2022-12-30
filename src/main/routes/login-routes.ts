import { Router } from 'express'
import { expressRoutesAdapter } from '../adapters/express/express-routes-adapter'
import { makeLoginController } from '../factories/login/login-factory'
import { makeSignUpController } from '../factories/signup/signup-factory'

export default (router: Router): void => {
  router.post('/signup', expressRoutesAdapter(makeSignUpController()))
  router.post('/login', expressRoutesAdapter(makeLoginController()))
}
