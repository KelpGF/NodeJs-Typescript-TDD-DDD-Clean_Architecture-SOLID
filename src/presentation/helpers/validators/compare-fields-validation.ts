import { InvalidParamError } from '../../errors'
import { Validation } from './validation'

export class CompareFieldsValidation implements Validation {
  private readonly fieldName: string
  private readonly fieldToCompareName: string

  constructor (fieldName: string, fieldToCompareName: string) {
    this.fieldName = fieldName
    this.fieldToCompareName = fieldToCompareName
  }

  validate (input: any): Error | null {
    return input[this.fieldName] !== input[this.fieldToCompareName] ? new InvalidParamError(this.fieldToCompareName) : null
  }
}
