import { AccountModel } from '../../domain/models/account'
import { AccessDeniedError } from '../errors/access-denied-error'
import { forbidden, internalServerError, ok } from '../helpers/http/http-helper'
import { HttpRequest, FindAccountByToken } from './auth-middleware-protocols'
import { AuthMiddleware } from './auth-middleware'

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_pass'
})
const makeFindAccountByTokenStub = (): FindAccountByToken => {
  class FindAccountByTokenStub implements FindAccountByToken {
    async find (accessToken: string): Promise<AccountModel | null> {
      return makeFakeAccount()
    }
  }

  return new FindAccountByTokenStub()
}
const makeFakeRequest = (): HttpRequest => ({
  headers: { 'x-access-token': 'any_token' }
})
interface SutTypes {
  sut: AuthMiddleware
  findAccountByTokenStub: FindAccountByToken
}
const makeSut = (role?: string): SutTypes => {
  const findAccountByTokenStub = makeFindAccountByTokenStub()
  const sut = new AuthMiddleware(findAccountByTokenStub, String(role))

  return { sut, findAccountByTokenStub }
}

describe('Auth Middleware', () => {
  test('Should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should call FindAccountByToken correct accessToken', async () => {
    const role = 'any_role'
    const { sut, findAccountByTokenStub } = makeSut(role)
    const findSpy = jest.spyOn(findAccountByTokenStub, 'find')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(findSpy).toHaveBeenCalledWith(httpRequest.headers['x-access-token'], role)
  })

  test('Should return 403 if FindAccountByToken returns null', async () => {
    const { sut, findAccountByTokenStub } = makeSut()
    jest.spyOn(findAccountByTokenStub, 'find').mockResolvedValueOnce(null)
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should return 200 if FindAccountByToken returns a account', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok({ accountId: 'valid_id' }))
  })

  test('Should return 500 if FindAccountByToken throws', async () => {
    const { sut, findAccountByTokenStub } = makeSut()
    jest.spyOn(findAccountByTokenStub, 'find').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(internalServerError(new Error()))
  })
})
