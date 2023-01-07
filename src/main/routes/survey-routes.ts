import { Router } from 'express'
import { expressMiddlewareAdapter } from '../adapters/express-middleware-adapter'
import { expressRoutesAdapter } from '../adapters/express-routes-adapter'
import { makeAddSurveyController } from '../factories/controllers/survey/add-survey/add-survey-controller-factory'
import { makeAuthMiddleware } from '../factories/middlewares/auth-middleware-factory'

export default (router: Router): void => {
  const adminAuth = expressMiddlewareAdapter(makeAuthMiddleware('admin'))
  router.post('/surveys', adminAuth, expressRoutesAdapter(makeAddSurveyController()))
}
