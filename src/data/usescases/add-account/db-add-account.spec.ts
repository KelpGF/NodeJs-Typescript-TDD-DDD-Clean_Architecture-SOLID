import { AddAccount, AddAccountModel, Encrypter } from './db-add-account-protocol'
import { DBAddAccount } from './db-add-account'

interface SutTypes {
  sut: AddAccount
  encrypterStub: Encrypter
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return await Promise.resolve('hashed_password')
    }
  }

  const encrypterStub = new EncrypterStub()

  return encrypterStub
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter()
  const sut = new DBAddAccount(encrypterStub)

  return { sut, encrypterStub }
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
})
