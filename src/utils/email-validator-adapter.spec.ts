import { EmailValidatorAdapter } from './email-validator-adapter'
import validator from 'validator'

jest.mock('validator', () => ({
  isEmail (): boolean {
    return true
  }
}))

describe('EmailValidator Adapter', () => {
  test('Should returns false if validator returns false', () => {
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)

    const sut = new EmailValidatorAdapter()
    const isValid = sut.isValid('invalid_email')

    expect(isValid).toBe(false)
  })

  test('Should returns true if validator returns true', () => {
    const sut = new EmailValidatorAdapter()
    const isValid = sut.isValid('valid_email@gmail.com')

    expect(isValid).toBe(true)
  })

  test('Should call validator with correct email', () => {
    const sut = new EmailValidatorAdapter()
    const isEmailSpy = jest.spyOn(validator, 'isEmail')

    sut.isValid('any_email@gmail.com')
    expect(isEmailSpy).toHaveBeenCalledWith('any_email@gmail.com')
  })
})
