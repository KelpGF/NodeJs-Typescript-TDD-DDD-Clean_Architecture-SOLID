import { Router } from 'express'
import { expressRoutesAdapter } from '../adapters/express-routes-adapter'
import { makeSignUpController } from '../factories/signup'

export default (router: Router): void => {
  router.post('/signup', expressRoutesAdapter(makeSignUpController()))
}