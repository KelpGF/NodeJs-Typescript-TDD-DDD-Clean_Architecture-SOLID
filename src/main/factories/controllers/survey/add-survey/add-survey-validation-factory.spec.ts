import { Validation } from '../../../../../presentation/protocols'
import { RequiredFieldValidation, ValidationComposite } from '../../../../../validations/validators'
import { makeAddSurveyController } from './add-survey-controller-factory'

jest.mock('../../../../../validations/validators/validation-composite.ts')

describe('SurveyValidation Factory', () => {
  test('Should call ValidationComposite with all validation', () => {
    makeAddSurveyController()
    const validations: Validation[] = []
    for (const field of ['question', 'answers']) {
      validations.push(new RequiredFieldValidation(field))
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
