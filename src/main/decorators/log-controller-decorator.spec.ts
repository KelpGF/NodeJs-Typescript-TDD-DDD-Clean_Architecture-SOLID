import { LogControllerDecorator } from './log-controller-decorator'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { internalServerError, ok } from '@/presentation/helpers/http/http-helper'
import { LogErrorRepository } from '@/data/protocols/db/log'
import { mockAccountModel } from '@/domain/test'
import { mockLogErrorRepository } from '@/data/test'

type SutTypes = {
  sut: Controller
  stubController: Controller
  stubLogErrorRepository: LogErrorRepository
}

const makeStubController = (): Controller => {
  class StubController implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      return ok(mockAccountModel())
    }
  }

  return new StubController()
}
const makeSut = (): SutTypes => {
  const stubController = makeStubController()
  const stubLogErrorRepository = mockLogErrorRepository()
  const sut = new LogControllerDecorator(stubController, stubLogErrorRepository)

  return { sut, stubController, stubLogErrorRepository }
}
const mockRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_pass',
    passwordConfirmation: 'any_pass'
  }
})
const makeFakeInternalServerError = (): HttpResponse => {
  const fakeError = new Error()
  fakeError.stack = 'any_stack'
  return internalServerError(fakeError)
}

describe('Log Controller Decorator', () => {
  test('Should LogControllerDecorator calls controller handle with correct value', async () => {
    const { sut, stubController } = makeSut()
    const spyStubHandle = jest.spyOn(stubController, 'handle')
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)

    expect(spyStubHandle).toHaveBeenCalledWith(httpRequest)
  })

  test('Should LogControllerDecorator return the same result of the controller', async () => {
    const { sut } = makeSut()
    const httpRequest = mockRequest()
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(ok(mockAccountModel()))
  })

  test('Should call LogErrorRepository with correct erro if controller returns a server error', async () => {
    const { sut, stubController, stubLogErrorRepository } = makeSut()
    const httpRequest = mockRequest()
    const logSpy = jest.spyOn(stubLogErrorRepository, 'logError')
    jest.spyOn(stubController, 'handle').mockResolvedValueOnce(makeFakeInternalServerError())

    await sut.handle(httpRequest)
    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
