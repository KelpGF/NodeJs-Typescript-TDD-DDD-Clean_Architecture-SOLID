import { AccountModel, AddAccountModel, AddAccountRepository, Hasher } from './db-add-account-protocols'
import { DBAddAccount } from './db-add-account'

const makeHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (value: string): Promise<string> {
      return await Promise.resolve('hashed_password')
    }
  }

  const hasherStub = new HasherStub()

  return hasherStub
}
const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (account: AddAccountModel): Promise<AccountModel> {
      return await Promise.resolve(makeFakeAccount())
    }
  }

  const addAccountRepositoryStub = new AddAccountRepositoryStub()

  return addAccountRepositoryStub
}
const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_pass'
})
const makeFakeAddAccountData = (): AddAccountModel => ({
  email: 'valid_email@gmail.com',
  name: 'valid_name',
  password: 'valid_password'
})

interface SutTypes {
  sut: AddAccountRepository
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
}
const makeSut = (): SutTypes => {
  const hasherStub = makeHasher()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const sut = new DBAddAccount(hasherStub, addAccountRepositoryStub)

  return { sut, hasherStub, addAccountRepositoryStub }
}

describe('DBAddAccount UseCase', () => {
  test('Should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut()
    const hashSpy = jest.spyOn(hasherStub, 'hash')
    const accountData = makeFakeAddAccountData()

    await sut.add(accountData)
    expect(hashSpy).toHaveBeenCalledWith(accountData.password)
  })

  test('Should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hash').mockResolvedValueOnce(Promise.reject(new Error()))
    const promise = sut.add(makeFakeAddAccountData())

    await expect(promise).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct data', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    const accountData = makeFakeAddAccountData()

    await sut.add(accountData)
    expect(addSpy).toHaveBeenCalledWith({
      email: accountData.email,
      name: accountData.name,
      password: 'hashed_password'
    })
  })

  test('Should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockResolvedValueOnce(Promise.reject(new Error()))
    const promise = sut.add(makeFakeAddAccountData())

    await expect(promise).rejects.toThrow()
  })

  test('Should return an account on success', async () => {
    const { sut } = makeSut()
    const account = await sut.add(makeFakeAddAccountData())

    expect(account).toEqual(makeFakeAccount())
  })
})
