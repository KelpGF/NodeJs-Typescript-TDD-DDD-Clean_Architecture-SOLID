import { InternalServerError, UnauthorizedError } from '../../errors'
import { HttpResponse } from '../../protocols'

export const badRequest = (error: Error): HttpResponse => ({ statusCode: 400, body: error })
export const unauthorizedError = (): HttpResponse => ({ statusCode: 401, body: new UnauthorizedError() })
export const internalServerError = (error: Error): HttpResponse => ({ statusCode: 500, body: new InternalServerError(String(error.stack)) })
export const ok = (data: any): HttpResponse => ({ statusCode: 200, body: data })
