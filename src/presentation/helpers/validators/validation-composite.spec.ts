import { InvalidParamError, MissingParamError } from '../../errors'
import { Validation } from './validation'
import { ValidationComposite } from './validation-composite'

const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error | null {
      return null
    }
  }

  return new ValidationStub()
}

interface SutTypes {
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
})
