import { RequiredFieldValidation } from './required-field-validation'
import { MissingParamError } from '@/presentation/errors'

const makeSut = (): RequiredFieldValidation => {
  return new RequiredFieldValidation('any_field')
}

describe('RequiredField Validation', () => {
  test('Should return a MissingParamError if validation fails', () => {
    const sut = makeSut()
    const error = sut.validate({})

    expect(error).toEqual(new MissingParamError('any_field'))
  })

  test('Should return null if validation success', () => {
    const sut = makeSut()
    const error = sut.validate({ any_field: 'any_value' })

    expect(error).toBeNull()
  })
})
