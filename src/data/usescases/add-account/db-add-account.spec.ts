import { AddAccountModel } from '../../../domain/usecases/add-account'
import { DBAddAccount } from './db-add-account'

describe('DBAccount UseCase', () => {
  test('Should call Encrypter with correct password', async () => {
    class EncrypterStub {
      async encrypt (value: string): Promise<string> {
        return await Promise.resolve('hashed_password')
      }
    }

    const encrypterStub = new EncrypterStub()
    const sut = new DBAddAccount(encrypterStub)
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')

    const accountData: AddAccountModel = {
      email: 'valid_email@gmail.com',
      name: 'valid_name',
      password: 'valid_password'
    }

    await sut.add(accountData)

    expect(encryptSpy).toHaveBeenCalledWith(accountData.password)
  })
})
