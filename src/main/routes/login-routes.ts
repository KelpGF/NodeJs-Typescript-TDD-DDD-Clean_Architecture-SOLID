import { Router } from 'express'
import { expressRoutesAdapter } from '../adapters/express/express-routes-adapter'
import { makeLoginController } from '../factories/controllers/login/login-controller-factory'
import { makeSignUpController } from '../factories/controllers/signup/signup-controller-factory'

export default (router: Router): void => {
  router.post('/signup', expressRoutesAdapter(makeSignUpController()))
  router.post('/login', expressRoutesAdapter(makeLoginController()))
}
