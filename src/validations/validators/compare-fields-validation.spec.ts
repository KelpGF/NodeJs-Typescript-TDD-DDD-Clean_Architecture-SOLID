import { InvalidParamError } from '../../presentation/errors'
import { CompareFieldsValidation } from './compare-fields-validation'

const makeSut = (): CompareFieldsValidation => {
  return new CompareFieldsValidation('any_field', 'compare_field')
}

describe('RequiredField Validation', () => {
  test('Should return a InvalidParamError if validation fails', () => {
    const sut = makeSut()
    const error = sut.validate({ any_field: 'any_value', compare_field: 'other_value' })

    expect(error).toEqual(new InvalidParamError('compare_field'))
  })

  test('Should return null if validation success', () => {
    const sut = makeSut()
    const error = sut.validate({ any_field: 'any_value', compare_field: 'any_value' })

    expect(error).toBeNull()
  })
})
