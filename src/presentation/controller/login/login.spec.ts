import { LoginController } from './login'
import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'

describe('Login Controller', () => {
  test('Should returns 400 if no email is provided', async () => {
    const sut = new LoginController()
    const httpRequest = { body: { password: 'any_password' } }
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })
})
