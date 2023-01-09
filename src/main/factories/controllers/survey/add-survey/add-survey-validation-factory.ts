import { Validation } from '@/presentation/protocols'
import { RequiredFieldValidation, ValidationComposite } from '@/validations/validators'

export const makeAddSurveyValidation = (): Validation => {
  const validations: Validation[] = []
  for (const field of ['question', 'answers']) {
    validations.push(new RequiredFieldValidation(field))
  }
  return new ValidationComposite(validations)
}
