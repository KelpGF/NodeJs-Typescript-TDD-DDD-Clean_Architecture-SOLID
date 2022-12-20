import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

describe('BcryptAdapter', () => {
  test('Should call bcrypt with correct values', async () => {
    const salt = 12
    const value = 'any_value'

    const sut = new BcryptAdapter(salt)
    const encryptSpy = jest.spyOn(bcrypt, 'hash')

    await sut.encrypt(value)
    expect(encryptSpy).toHaveBeenCalledWith(value, salt)
  })
})
