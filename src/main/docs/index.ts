import { badRequestComponent, internalServerErrorComponent, notFoundComponent, unauthorizedComponent } from './components'
import { accountSchema, errorSchema, loginParamsSchema } from './schemas'
import { loginPath } from './paths'

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
  tags: [{
    name: 'Login'
  }],
  paths: {
    '/login': loginPath
  },
  schemas: {
    error: errorSchema,
    account: accountSchema,
    loginParams: loginParamsSchema
  },
  components: {
    badRequest: badRequestComponent,
    notFound: notFoundComponent,
    unauthorized: unauthorizedComponent,
    internalServerError: internalServerErrorComponent
  }
}
