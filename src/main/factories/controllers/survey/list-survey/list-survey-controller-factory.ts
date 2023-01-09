import { makeDbListSurvey } from '@/main/factories/usecases/survey/list-survey/db-list-survey-factory'
import { makeLogControllerDecoratorFactory } from '@/main/factories/decorators/log-controller-decorator-factory'
import { Controller } from '@/presentation/protocols'
import { ListSurveyController } from '@/presentation/controller/survey/list-surveys/list-surveys-controller'

export const makeListSurveyController = (): Controller => {
  const listSurveyController = new ListSurveyController(makeDbListSurvey())
  return makeLogControllerDecoratorFactory(listSurveyController)
}
