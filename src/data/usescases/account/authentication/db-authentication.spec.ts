import { DbAuthentication } from './db-authentication'
import {
  AccountModel,
  AuthenticationParams,
  FindAccountByEmailRepository,
  HashComparer,
  Encrypter,
  UpdateAccessTokenRepository
} from './db-authentication-protocols'

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  email: 'any_email@mail.com',
  name: 'any_name',
  password: 'hashed_pass'
})
const makeFindAccountByEmailRepositoryStub = (): FindAccountByEmailRepository => {
  class FindAccountByEmailRepositoryStub implements FindAccountByEmailRepository {
    async findByEmail (email: string): Promise<AccountModel | null> {
      return makeFakeAccount()
    }
  }

  return new FindAccountByEmailRepositoryStub()
}
const makeHashComparerStub = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare (hash: string): Promise<boolean> {
      return true
    }
  }

  return new HashComparerStub()
}

const makeEncrypterStub = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (id: string): Promise<string> {
      return 'valid_token'
    }
  }

  return new EncrypterStub()
}
const makeUpdateAccessTokenRepositoryStub = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateAccessToken (id: string, accessToken: string): Promise<void> {
      return await Promise.resolve()
    }
  }

  return new UpdateAccessTokenRepositoryStub()
}

type SutTypes = {
  sut: DbAuthentication
  findAccountByEmailRepositoryStub: FindAccountByEmailRepository
  hashComparerStub: HashComparer
  tokenGeneratorStub: Encrypter
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}
const makeSut = (): SutTypes => {
  const findAccountByEmailRepositoryStub = makeFindAccountByEmailRepositoryStub()
  const hashComparerStub = makeHashComparerStub()
  const tokenGeneratorStub = makeEncrypterStub()
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepositoryStub()
  const sut = new DbAuthentication(
    findAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub,
    updateAccessTokenRepositoryStub
  )

  return {
    sut,
    findAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub,
    updateAccessTokenRepositoryStub
  }
}

const makeFakeAuthenticationParams = (): AuthenticationParams => ({
  email: 'any_email@mail.com',
  password: 'any_pass'
})

describe('DbAuthentication UseCase', () => {
  test('Should call FindAccountByEmailRepository with correct email', async () => {
    const { sut, findAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(findAccountByEmailRepositoryStub, 'findByEmail')
    const authenticationParams = makeFakeAuthenticationParams()
    await sut.auth(authenticationParams)
    expect(loadSpy).toHaveBeenCalledWith(authenticationParams.email)
  })

  test('Should throw if FindAccountByEmailRepository throws', async () => {
    const { sut, findAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(findAccountByEmailRepositoryStub, 'findByEmail').mockRejectedValueOnce(new Error())
    const promise = sut.auth(makeFakeAuthenticationParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should return null if FindAccountByEmailRepository with returns null', async () => {
    const { sut, findAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(findAccountByEmailRepositoryStub, 'findByEmail').mockResolvedValueOnce(null)
    const authenticationParams = makeFakeAuthenticationParams()
    const accessToken = await sut.auth(authenticationParams)
    expect(accessToken).toBeNull()
  })

  test('Should call HashComparer with corrects values', async () => {
    const { sut, hashComparerStub } = makeSut()
    const comparerSpy = jest.spyOn(hashComparerStub, 'compare')
    const authenticationParams = makeFakeAuthenticationParams()
    await sut.auth(authenticationParams)
    expect(comparerSpy).toHaveBeenCalledWith(authenticationParams.password, 'hashed_pass')
  })

  test('Should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockRejectedValueOnce(new Error())
    const promise = sut.auth(makeFakeAuthenticationParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should return null if HashComparer return false', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockResolvedValueOnce(false)
    const accessToken = await sut.auth(makeFakeAuthenticationParams())
    expect(accessToken).toBeNull()
  })

  test('Should call Encrypter with correct value', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    const generatorSpy = jest.spyOn(tokenGeneratorStub, 'encrypt')
    await sut.auth(makeFakeAuthenticationParams())
    expect(generatorSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should throw if Encrypter throws', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    jest.spyOn(tokenGeneratorStub, 'encrypt').mockRejectedValueOnce(new Error())
    const promise = sut.auth(makeFakeAuthenticationParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should return accessToken if success', async () => {
    const { sut } = makeSut()
    const accessToken = await sut.auth(makeFakeAuthenticationParams())
    expect(accessToken).toBe('valid_token')
  })

  test('Should call UpdateAccessTokenRepository with corrects values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
    const accessToken = await sut.auth(makeFakeAuthenticationParams())
    expect(updateSpy).toHaveBeenCalledWith('any_id', accessToken)
  })

  test('Should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken').mockRejectedValueOnce(new Error())
    const promise = sut.auth(makeFakeAuthenticationParams())
    await expect(promise).rejects.toThrow()
  })
})
