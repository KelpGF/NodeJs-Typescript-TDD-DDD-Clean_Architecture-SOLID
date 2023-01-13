import { AuthMiddleware } from './auth-middleware'
import { HttpRequest, SearchAccountByToken } from './auth-middleware-protocols'
import { AccessDeniedError } from '@/presentation/errors/access-denied-error'
import { forbidden, internalServerError, ok } from '@/presentation/helpers/http/http-helper'
import { mockAccountModel } from '@/domain/test'
import { mockSearchAccountByToken } from '@/presentation/test'

const mockRequest = (): HttpRequest => ({
  headers: { 'x-access-token': 'any_token' }
})
type SutTypes = {
  sut: AuthMiddleware
  SearchAccountByTokenStub: SearchAccountByToken
}
const makeSut = (role?: string): SutTypes => {
  const SearchAccountByTokenStub = mockSearchAccountByToken()
  const sut = new AuthMiddleware(SearchAccountByTokenStub, String(role))

  return { sut, SearchAccountByTokenStub }
}

describe('Auth Middleware', () => {
  test('Should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should call SearchAccountByToken correct accessToken', async () => {
    const role = 'any_role'
    const { sut, SearchAccountByTokenStub } = makeSut(role)
    const findSpy = jest.spyOn(SearchAccountByTokenStub, 'search')
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(findSpy).toHaveBeenCalledWith(httpRequest.headers['x-access-token'], role)
  })

  test('Should return 403 if SearchAccountByToken returns null', async () => {
    const { sut, SearchAccountByTokenStub } = makeSut()
    jest.spyOn(SearchAccountByTokenStub, 'search').mockResolvedValueOnce(null)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should return 200 if SearchAccountByToken returns a account', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok({ accountId: mockAccountModel().id }))
  })

  test('Should return 500 if SearchAccountByToken throws', async () => {
    const { sut, SearchAccountByTokenStub } = makeSut()
    jest.spyOn(SearchAccountByTokenStub, 'search').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(internalServerError(new Error()))
  })
})
