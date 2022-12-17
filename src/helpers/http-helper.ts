import { HttpResponse } from '../presentation/protocol/http'

export const badRequest = (error: Error): HttpResponse => ({ statusCode: 400, body: error })
