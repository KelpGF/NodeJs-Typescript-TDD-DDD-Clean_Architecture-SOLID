import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  hash: async () => await Promise.resolve('hash')
}))

describe('BcryptAdapter', () => {
  test('Should call bcrypt with correct values', async () => {
    const salt = 12
    const value = 'any_value'

    const sut = new BcryptAdapter(salt)
    const hashSpy = jest.spyOn(bcrypt, 'hash')

    await sut.encrypt(value)
    expect(hashSpy).toHaveBeenCalledWith(value, salt)
  })

  test('Should return a hash on success', async () => {
    const salt = 12
    const value = 'any_value'

    const sut = new BcryptAdapter(salt)
    const hash = await sut.encrypt(value)

    expect(hash).toEqual('hash')
  })
})
