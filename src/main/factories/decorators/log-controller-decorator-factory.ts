import { LogMongoRepository } from '@/infra/db/mongodb/log/log-mongo-repository'
import { Controller } from '@/presentation/protocols'
import { LogControllerDecorator } from '@/main/decorators/log-controller-decorator'

export const makeLogControllerDecoratorFactory = (controller: Controller): Controller => {
  const logRepository = new LogMongoRepository()
  return new LogControllerDecorator(controller, logRepository)
}
