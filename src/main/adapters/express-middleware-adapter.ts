import { NextFunction, Request, Response } from 'express'
import { HttpRequest, Middleware } from '../../presentation/protocols'

export const expressMiddlewareAdapter = (middleware: Middleware) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const httpRequest: HttpRequest = {
      headers: req.headers
    }
    const { statusCode, body } = await middleware.handle(httpRequest)

    if (statusCode === 200) {
      Object.assign(req, body)
      next()
    } else {
      res.status(statusCode).json({ error: body.message })
    }
  }
}
