import { AuthMiddleware } from './auth-middleware'
import { HttpRequest, SearchAccountByToken } from './auth-middleware-protocols'
import { AccessDeniedError } from '../errors/access-denied-error'
import { forbidden, internalServerError, ok } from '../helpers/http/http-helper'
import { AccountModel } from '@/domain/models/account'

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_pass'
})
const makeSearchAccountByTokenStub = (): SearchAccountByToken => {
  class SearchAccountByTokenStub implements SearchAccountByToken {
    async search (accessToken: string): Promise<AccountModel | null> {
      return makeFakeAccount()
    }
  }

  return new SearchAccountByTokenStub()
}
const makeFakeRequest = (): HttpRequest => ({
  headers: { 'x-access-token': 'any_token' }
})
type SutTypes = {
  sut: AuthMiddleware
  SearchAccountByTokenStub: SearchAccountByToken
}
const makeSut = (role?: string): SutTypes => {
  const SearchAccountByTokenStub = makeSearchAccountByTokenStub()
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
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(findSpy).toHaveBeenCalledWith(httpRequest.headers['x-access-token'], role)
  })

  test('Should return 403 if SearchAccountByToken returns null', async () => {
    const { sut, SearchAccountByTokenStub } = makeSut()
    jest.spyOn(SearchAccountByTokenStub, 'search').mockResolvedValueOnce(null)
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should return 200 if SearchAccountByToken returns a account', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok({ accountId: 'valid_id' }))
  })

  test('Should return 500 if SearchAccountByToken throws', async () => {
    const { sut, SearchAccountByTokenStub } = makeSut()
    jest.spyOn(SearchAccountByTokenStub, 'search').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(internalServerError(new Error()))
  })
})
