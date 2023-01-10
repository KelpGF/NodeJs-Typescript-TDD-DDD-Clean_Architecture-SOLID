import { ValidationComposite } from './validation-composite'
import { Validation } from '@/presentation/protocols'
import { InvalidParamError, MissingParamError } from '@/presentation/errors'

const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error | null {
      return null
    }
  }

  return new ValidationStub()
}

type SutTypes = {
  sut: ValidationComposite
  validationsStub: Validation[]
}
const makeSut = (): SutTypes => {
  const validationsStub = [makeValidationStub(), makeValidationStub()]
  const sut = new ValidationComposite(validationsStub)

  return { sut, validationsStub }
}

describe('Validation Composite', () => {
  test('Should return an error if any validation fails', () => {
    const { sut, validationsStub } = makeSut()
    jest.spyOn(validationsStub[1], 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const error = sut.validate({})
    expect(error).toEqual(new MissingParamError('any_field'))
  })

  test('Should return the first error more then one validation fails', () => {
    const { sut, validationsStub } = makeSut()
    jest.spyOn(validationsStub[0], 'validate').mockReturnValueOnce(new InvalidParamError('invalid_field'))
    jest.spyOn(validationsStub[1], 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const error = sut.validate({})
    expect(error).toEqual(new InvalidParamError('invalid_field'))
  })

  test('Should return null if validation success', () => {
    const { sut } = makeSut()
    const error = sut.validate({ any_field: 'any_value' })
    expect(error).toBeNull()
  })
})
