import {
  loginPath,
  signupPath,
  surveysPath,
  surveyResultPath
} from './paths/'

export default {
  '/login': loginPath,
  '/signup': signupPath,
  '/surveys': surveysPath,
  '/surveys/{surveyId}/results': surveyResultPath
}
