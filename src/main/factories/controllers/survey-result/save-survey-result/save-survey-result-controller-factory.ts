import { makeLogControllerDecoratorFactory } from '@/main/factories/decorators/log-controller-decorator-factory'
import { makeDbSearchSurveyById } from '@/main/factories/usecases/survey/list-survey/db-search-survey-by-id-factory'
import { makeDbSaveSurveyResult } from '@/main/factories/usecases/survey/survey-result/db-save-survey-result-factory'
import { SaveSurveyResultController } from '@/presentation/controller/survey-result/save-survey-result/save-survey-result-controller'
import { Controller } from '@/presentation/protocols'

export const makeSaveSurveyResultController = (): Controller => {
  const controller = new SaveSurveyResultController(makeDbSearchSurveyById(), makeDbSaveSurveyResult())
  return makeLogControllerDecoratorFactory(controller)
}
