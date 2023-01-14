
import { apiKeySchema } from './schemas/'
import {
  badRequestComponent,
  forbiddenComponent,
  internalServerErrorComponent,
  notFoundComponent,
  unauthorizedComponent
} from './components/'

export default {
  securitySchemes: { apiKeyAuth: apiKeySchema },
  badRequest: badRequestComponent,
  unauthorized: unauthorizedComponent,
  forbidden: forbiddenComponent,
  notFound: notFoundComponent,
  internalServerError: internalServerErrorComponent
}
