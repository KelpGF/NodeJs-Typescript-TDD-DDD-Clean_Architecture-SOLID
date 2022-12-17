import { HttpResponse } from '../protocol/http'

export const badRequest = (error: Error): HttpResponse => ({ statusCode: 400, body: error })
