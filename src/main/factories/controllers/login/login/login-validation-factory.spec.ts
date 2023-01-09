import { makeLoginValidation } from './login-validation-factory'
import { Validation } from '@/presentation/protocols'
import { EmailValidation, RequiredFieldValidation, ValidationComposite } from '@/validations/validators'
import { EmailValidator } from '@/validations/protocols/email-validator'

jest.mock('@/validations/validators/validation-composite')

const makeEmailValidatorStub = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

describe('Login Validation', () => {
  test('makeLoginValidation Factory', () => {
    makeLoginValidation()
    const validations: Validation[] = []
    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new EmailValidation('email', makeEmailValidatorStub()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
