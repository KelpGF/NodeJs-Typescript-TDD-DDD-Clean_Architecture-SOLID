import { Router } from 'express'
import { expressRoutesAdapter } from '../adapters/express-routes-adapter'
import { makeAddSurveyController } from '../factories/controllers/survey/add-survey/add-survey-controller-factory'
import { makeListSurveyController } from '../factories/controllers/survey/list-survey/list-survey-controller-factory'
import { adminAuth } from '../middlewares/admin-auth'
import { auth } from '../middlewares/auth'

export default (router: Router): void => {
  router.get('/surveys', auth, expressRoutesAdapter(makeListSurveyController()))
  router.post('/surveys', adminAuth, expressRoutesAdapter(makeAddSurveyController()))
}
