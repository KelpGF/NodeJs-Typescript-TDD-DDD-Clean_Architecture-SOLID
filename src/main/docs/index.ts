import {
  badRequestComponent,
  forbiddenComponent,
  internalServerErrorComponent,
  notFoundComponent,
  unauthorizedComponent
} from './components'
import {
  accountSchema,
  apiKeySchema,
  errorSchema,
  loginParamsSchema,
  signUpParamsSchema,
  addSurveyParamsSchema,
  surveyAnswerSchema,
  surveyListSchema,
  surveySchema
} from './schemas'
import { loginPath, signupPath, surveysPath } from './paths'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node API',
    description: 'API criada utilizando Clean Arq, SOLID e TDD',
    version: '1.0.0',
    license: {
      name: 'ISC',
      url: 'https://opensource.org/licenses/ISC'
    }
  },
  servers: [{
    url: '/api'
  }],
  tags: [
    { name: 'Login' },
    { name: 'SignUp' },
    { name: 'Enquete' }
  ],
  paths: {
    '/login': loginPath,
    '/signup': signupPath,
    '/surveys': surveysPath
  },
  schemas: {
    error: errorSchema,
    loginParams: loginParamsSchema,
    signUpParams: signUpParamsSchema,
    account: accountSchema,
    addSurveyParams: addSurveyParamsSchema,
    survey: surveySchema,
    surveyAnswer: surveyAnswerSchema,
    surveyList: surveyListSchema
  },
  components: {
    securitySchemes: { apiKeyAuth: apiKeySchema },
    badRequest: badRequestComponent,
    unauthorized: unauthorizedComponent,
    forbidden: forbiddenComponent,
    notFound: notFoundComponent,
    internalServerError: internalServerErrorComponent
  }
}
