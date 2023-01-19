import { makeLogControllerDecoratorFactory } from '@/main/factories/decorators/log-controller-decorator-factory'
import { makeDbGetSurveyResult } from '@/main/factories/usecases/survey-result/db-get-survey-result-factory'
import { makeDbSearchSurveyById } from '@/main/factories/usecases/survey/list-survey/db-search-survey-by-id-factory'
import { GetSurveyResultController } from '@/presentation/controller/survey-result/get-survey-result-by-survey-id/get-survey-result-controller'
import { Controller } from '@/presentation/protocols'

export const makeGetSurveyResultController = (): Controller => {
  const controller = new GetSurveyResultController(makeDbSearchSurveyById(), makeDbGetSurveyResult())
  return makeLogControllerDecoratorFactory(controller)
}
