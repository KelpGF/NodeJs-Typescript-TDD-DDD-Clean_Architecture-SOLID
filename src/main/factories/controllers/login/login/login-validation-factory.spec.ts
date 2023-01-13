import { makeLoginValidation } from './login-validation-factory'
import { Validation } from '@/presentation/protocols'
import { mockEmailValidator } from '@/validations/test'
import { EmailValidation, RequiredFieldValidation, ValidationComposite } from '@/validations/validators'

jest.mock('@/validations/validators/validation-composite')

describe('Login Validation', () => {
  test('makeLoginValidation Factory', () => {
    makeLoginValidation()
    const validations: Validation[] = []
    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new EmailValidation('email', mockEmailValidator()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
