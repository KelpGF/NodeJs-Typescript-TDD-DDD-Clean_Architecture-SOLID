import { loginPath } from './paths/loginPath'
import { accountSchema } from './schemas/account-schema'
import { loginParamsSchema } from './schemas/login-schema'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node API',
    description: 'API criada utilizando Clean Arq, SOLID e TDD',
    version: '1.0.0'
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
    account: accountSchema,
    loginParams: loginParamsSchema
  }
}
