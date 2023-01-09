import { makeAddSurveyValidation } from './add-survey-validation-factory'
import { makeDbAddSurvey } from '@/main/factories/usecases/survey/add-survey/db-add-survey-factory'
import { makeLogControllerDecoratorFactory } from '@/main/factories/decorators/log-controller-decorator-factory'
import { Controller } from '@/presentation/protocols'
import { AddSurveyController } from '@/presentation/controller/survey/add/add-survey-controller'

export const makeAddSurveyController = (): Controller => {
  const addSurveyController = new AddSurveyController(makeAddSurveyValidation(), makeDbAddSurvey())
  return makeLogControllerDecoratorFactory(addSurveyController)
}
