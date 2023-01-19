import { Router } from 'express'
import { expressRoutesAdapter } from '../adapters/express-routes-adapter'
import { makeGetSurveyResultController } from '../factories/controllers/survey-result/get-survey-result/get-survey-result-controller-factory'
import { makeSaveSurveyResultController } from '../factories/controllers/survey-result/save-survey-result/save-survey-result-controller-factory'
import { auth } from '../middlewares/auth'

export default (router: Router): void => {
  router.get('/surveys/:surveyId/results', auth, expressRoutesAdapter(makeGetSurveyResultController()))
  router.put('/surveys/:surveyId/results', auth, expressRoutesAdapter(makeSaveSurveyResultController()))
}
