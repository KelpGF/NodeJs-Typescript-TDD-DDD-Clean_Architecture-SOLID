import { InvalidParamError } from '../../presentation/errors'
import { Validation } from '../../presentation/protocols'
import { EmailValidator } from '../protocols/email-validator'

export class EmailValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly emailValidator: EmailValidator
  ) {}

  validate (input: any): Error | null {
    const isValidEmail = this.emailValidator.isValid(input[this.fieldName])
    return !isValidEmail ? new InvalidParamError(this.fieldName) : null
  }
}
