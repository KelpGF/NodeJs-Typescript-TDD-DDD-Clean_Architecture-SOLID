import { Request, Response } from 'express'
import { Controller, HttpRequest } from '@/presentation/protocols'

export const expressRoutesAdapter = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body,
      params: req.params,
      accountId: req.accountId
    }
    const { statusCode, body } = await controller.handle(httpRequest)

    res.status(statusCode).json(statusCode >= 200 && statusCode <= 299 ? body : { error: body.message })
  }
}
