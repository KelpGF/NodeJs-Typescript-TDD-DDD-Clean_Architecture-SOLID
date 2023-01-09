import validator from 'validator'
import { EmailValidatorAdapter } from './email-validator-adapter'
import { EmailValidator } from '@/validations/protocols/email-validator'

jest.mock('validator', () => ({
  isEmail (): boolean {
    return true
  }
}))

const makeSut = (): EmailValidator => {
  return new EmailValidatorAdapter()
}

describe('EmailValidator Adapter', () => {
  test('Should returns false if validator returns false', () => {
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)

    const sut = makeSut()
    const isValid = sut.isValid('invalid_email')

    expect(isValid).toBe(false)
  })

  test('Should returns true if validator returns true', () => {
    const sut = makeSut()
    const isValid = sut.isValid('valid_email@gmail.com')

    expect(isValid).toBe(true)
  })

  test('Should call validator with correct email', () => {
    const sut = makeSut()
    const isEmailSpy = jest.spyOn(validator, 'isEmail')

    sut.isValid('any_email@gmail.com')
    expect(isEmailSpy).toHaveBeenCalledWith('any_email@gmail.com')
  })
})
