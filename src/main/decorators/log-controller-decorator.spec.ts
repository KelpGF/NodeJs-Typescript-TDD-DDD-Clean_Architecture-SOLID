import { LogErrorRepository } from '../../data/protocols/db/log'
import { AccountModel } from '../../domain/models/account'
import { internalServerError, ok } from '../../presentation/helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log-controller-decorator'

describe('Log Controller Decorator', () => {
  interface SutTypes {
    sut: Controller
    stubController: Controller
    stubLogErrorRepository: LogErrorRepository
  }

  const makeStubController = (): Controller => {
    class StubController implements Controller {
      async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        return ok(makeFakeAccount())
      }
    }

    return new StubController()
  }
  const makeStubLogErrorRepository = (): LogErrorRepository => {
    class StubLogErrorRepository implements LogErrorRepository {
      async logError (stack: string): Promise<void> {
        return await Promise.resolve()
      }
    }

    return new StubLogErrorRepository()
  }
  const makeSut = (): SutTypes => {
    const stubController = makeStubController()
    const stubLogErrorRepository = makeStubLogErrorRepository()
    const sut = new LogControllerDecorator(stubController, stubLogErrorRepository)

    return { sut, stubController, stubLogErrorRepository }
  }
  const makeFakeRequest = (): HttpRequest => ({
    body: {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_pass',
      passwordConfirmation: 'any_pass'
    }
  })
  const makeFakeAccount = (): AccountModel => ({
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'valid_pass'
  })
  const makeFakeInternalServerError = (): HttpResponse => {
    const fakeError = new Error()
    fakeError.stack = 'any_stack'
    return internalServerError(fakeError)
  }

  test('Should LogControllerDecorator calls controller handle with correct value', async () => {
    const { sut, stubController } = makeSut()
    const spyStubHandle = jest.spyOn(stubController, 'handle')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)

    expect(spyStubHandle).toHaveBeenCalledWith(httpRequest)
  })

  test('Should LogControllerDecorator return the same result of the controller', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(ok(makeFakeAccount()))
  })

  test('Should call LogErrorRepository with correct erro if controller returns a server error', async () => {
    const { sut, stubController, stubLogErrorRepository } = makeSut()
    const httpRequest = makeFakeRequest()
    const logSpy = jest.spyOn(stubLogErrorRepository, 'logError')
    jest.spyOn(stubController, 'handle').mockResolvedValueOnce(makeFakeInternalServerError())

    await sut.handle(httpRequest)
    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
