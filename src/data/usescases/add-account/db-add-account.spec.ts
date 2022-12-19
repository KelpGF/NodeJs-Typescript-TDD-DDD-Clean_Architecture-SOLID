import { AccountModel, AddAccountModel, AddAccountRepository, Encrypter } from './db-add-account-protocol'
import { DBAddAccount } from './db-add-account'

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return await Promise.resolve('hashed_password')
    }
  }

  const encrypterStub = new EncrypterStub()

  return encrypterStub
}
const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = { id: 'valid_id', email: account.email, name: account.name, password: 'hashed_password' }
      return await Promise.resolve(fakeAccount)
    }
  }

  const addAccountRepositoryStub = new AddAccountRepositoryStub()

  return addAccountRepositoryStub
}

interface SutTypes {
  sut: AddAccountRepository
  encrypterStub: Encrypter
  addAccountRepositoryStub: AddAccountRepository
}
const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const sut = new DBAddAccount(encrypterStub, addAccountRepositoryStub)

  return { sut, encrypterStub, addAccountRepositoryStub }
}

describe('DBAddAccount UseCase', () => {
  test('Should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')

    const accountData: AddAccountModel = {
      email: 'valid_email@gmail.com',
      name: 'valid_name',
      password: 'valid_password'
    }

    await sut.add(accountData)

    expect(encryptSpy).toHaveBeenCalledWith(accountData.password)
  })

  test('Should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockResolvedValueOnce(Promise.reject(new Error()))

    const accountData: AddAccountModel = {
      email: 'valid_email@gmail.com',
      name: 'valid_name',
      password: 'valid_password'
    }

    const promise = sut.add(accountData)

    await expect(promise).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct data', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')

    const accountData: AddAccountModel = {
      email: 'valid_email@gmail.com',
      name: 'valid_name',
      password: 'valid_password'
    }

    await sut.add(accountData)

    expect(addSpy).toHaveBeenCalledWith({
      email: 'valid_email@gmail.com',
      name: 'valid_name',
      password: 'hashed_password'
    })
  })
})
