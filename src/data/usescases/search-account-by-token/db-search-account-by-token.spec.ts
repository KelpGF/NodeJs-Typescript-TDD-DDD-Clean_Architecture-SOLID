import { DbSearchAccountByToken } from './db-search-account-by-token'
import { AccountModel, Decrypter, FindAccountByTokenRepository } from './db-search-account-by-token-protocols'

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  email: 'any_email@mail.com',
  name: 'any_name',
  password: 'hashed_pass'
})
const makeDecrypterStub = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (token: string): Promise<string | null> {
      return 'any_value'
    }
  }

  return new DecrypterStub()
}
const makeFindAccountByTokenRepositoryStub = (): FindAccountByTokenRepository => {
  class FindAccountByTokenRepositoryStub implements FindAccountByTokenRepository {
    async findByToken (token: string): Promise<AccountModel | null> {
      return makeFakeAccount()
    }
  }

  return new FindAccountByTokenRepositoryStub()
}

type SutTypes = {
  sut: DbSearchAccountByToken
  decrypterStub: Decrypter
  findAccountByTokenRepositoryStub: FindAccountByTokenRepository
}
const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypterStub()
  const findAccountByTokenRepositoryStub = makeFindAccountByTokenRepositoryStub()
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
    expect(account).toEqual(makeFakeAccount())
  })

  test('Should throw if FindAccountByTokenRepository throws', async () => {
    const { sut, findAccountByTokenRepositoryStub } = makeSut()
    jest.spyOn(findAccountByTokenRepositoryStub, 'findByToken').mockRejectedValueOnce(new Error())
    const promise = sut.search('any_token')
    await expect(promise).rejects.toThrow()
  })
})