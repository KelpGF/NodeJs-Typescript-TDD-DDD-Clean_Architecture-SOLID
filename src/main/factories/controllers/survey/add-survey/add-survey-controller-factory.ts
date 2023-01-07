import { makeAddSurveyValidation } from './add-survey-validation-factory'
import { dbAddSurveyFactory } from '../../../usecases/survey/add-survey/db-add-survey-factory'
import { Controller } from '../../../../../presentation/protocols'
import { AddSurveyController } from '../../../../../presentation/controller/survey/add/add-survey-controller'
import { makeLogControllerDecoratorFactory } from '../../../decorators/log-controller-decorator-factory'

export const makeAddSurveyController = (): Controller => {
  const addSurveyController = new AddSurveyController(makeAddSurveyValidation(), dbAddSurveyFactory())
  return makeLogControllerDecoratorFactory(addSurveyController)
}
