import { InternalServerError } from '../errors'
import { HttpResponse } from '../protocols'

export const badRequest = (error: Error): HttpResponse => ({ statusCode: 400, body: error })
export const internalServerError = (error: Error): HttpResponse => ({ statusCode: 500, body: new InternalServerError(String(error.stack)) })
export const ok = (data: any): HttpResponse => ({ statusCode: 200, body: data })
