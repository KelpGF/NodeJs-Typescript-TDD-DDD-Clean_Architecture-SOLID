import { Controller } from '../../../../../presentation/protocols'
import { ListSurveyController } from '../../../../../presentation/controller/survey/list-surveys/list-surveys-controller'
import { makeDbListSurvey } from '../../../usecases/survey/list-survey/db-list-survey-factory'
import { makeLogControllerDecoratorFactory } from '../../../decorators/log-controller-decorator-factory'

export const makeListSurveyController = (): Controller => {
  const listSurveyController = new ListSurveyController(makeDbListSurvey())
  return makeLogControllerDecoratorFactory(listSurveyController)
}
