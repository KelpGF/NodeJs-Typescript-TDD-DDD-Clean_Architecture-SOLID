import { mockAccountModel } from '@/domain/test'
import { mockDecrypter, mockFindAccountByTokenRepository } from '@/data/test'
import { DbSearchAccountByToken } from './db-search-account-by-token'
import { Decrypter, FindAccountByTokenRepository } from './db-search-account-by-token-protocols'

type SutTypes = {
  sut: DbSearchAccountByToken
  decrypterStub: Decrypter
  findAccountByTokenRepositoryStub: FindAccountByTokenRepository
}
const makeSut = (): SutTypes => {
  const decrypterStub = mockDecrypter()
  const findAccountByTokenRepositoryStub = mockFindAccountByTokenRepository()
  const sut = new DbSearchAccountByToken(decrypterStub, findAccountByTokenRepositoryStub)

  return { sut, decrypterStub, findAccountByTokenRepositoryStub }
}

describe('DbSearchAccountByToken UseCase', () => {
  test('Should call Decrypter with correct values', async () => {
    const { sut, decrypterStub } = makeSut()
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
    await sut.search('any_token')
    expect(decryptSpy).toHaveBeenCalledWith('any_token')
  })

  test('Should return null if Decrypter returns null', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockResolvedValueOnce(null)
    const account = await sut.search('any_token')
    expect(account).toBeNull()
  })

  test('Should throw if Decrypter throws', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockRejectedValueOnce(new Error())
    const promise = sut.search('any_token')
    await expect(promise).rejects.toThrow()
  })

  test('Should call FindAccountByTokenRepository with correct value', async () => {
    const role = 'any_role'
    const { sut, findAccountByTokenRepositoryStub } = makeSut()
    const findByTokenSpy = jest.spyOn(findAccountByTokenRepositoryStub, 'findByToken')
    await sut.search('any_token', role)
    expect(findByTokenSpy).toHaveBeenCalledWith('any_token', role)
  })

  test('Should return null if FindAccountByTokenRepository returns null', async () => {
    const { sut, findAccountByTokenRepositoryStub } = makeSut()
    jest.spyOn(findAccountByTokenRepositoryStub, 'findByToken').mockResolvedValueOnce(null)
    const account = await sut.search('any_token')
    expect(account).toBeNull()
  })

  test('Should an account on succeeds', async () => {
    const { sut } = makeSut()
    const account = await sut.search('any_token')
    expect(account).toEqual(mockAccountModel())
  })

  test('Should throw if FindAccountByTokenRepository throws', async () => {
    const { sut, findAccountByTokenRepositoryStub } = makeSut()
    jest.spyOn(findAccountByTokenRepositoryStub, 'findByToken').mockRejectedValueOnce(new Error())
    const promise = sut.search('any_token')
    await expect(promise).rejects.toThrow()
  })
})
