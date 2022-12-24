import { LogErrorRepository } from '../../data/protocols/log-repository'
import { internalServerError } from '../../presentation/helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

describe('Log Controller Decorator', () => {
  interface SutTypes {
    sut: Controller
    stubController: Controller
    stubLogErrorRepository: LogErrorRepository
  }

  const makeStubController = (): Controller => {
    class StubController implements Controller {
      async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        const httpResponse: HttpResponse = {
          body: {
            name: 'any_name'
          },
          statusCode: 200
        }

        return httpResponse
      }
    }

    return new StubController()
  }
  const makeStubLogErrorRepository = (): LogErrorRepository => {
    class StubLogErrorRepository implements LogErrorRepository {
      async log (stack: string): Promise<void> {
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

  test('Should LogControllerDecorator calls controller handle with correct value', async () => {
    const { sut, stubController } = makeSut()
    const spyStubHandle = jest.spyOn(stubController, 'handle')
    const httpRequest: HttpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password',
        passwordConfirmation: 'any_confirmation_password'
      }
    }
    await sut.handle(httpRequest)

    expect(spyStubHandle).toHaveBeenCalledWith(httpRequest)
  })

  test('Should LogControllerDecorator return the same result of the controller', async () => {
    const { sut } = makeSut()
    const httpRequest: HttpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password',
        passwordConfirmation: 'any_confirmation_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual({
      body: {
        name: 'any_name'
      },
      statusCode: 200
    })
  })

  test('Should call LogErrorRepository with correct erro if controller returns a server error', async () => {
    const { sut, stubController, stubLogErrorRepository } = makeSut()

    const fakeError = new Error()
    fakeError.stack = 'any_stack'
    const error = internalServerError(fakeError)
    const logSpy = jest.spyOn(stubLogErrorRepository, 'log')
    const httpRequest: HttpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password',
        passwordConfirmation: 'any_confirmation_password'
      }
    }
    jest.spyOn(stubController, 'handle').mockReturnValueOnce(Promise.resolve(error))
    await sut.handle(httpRequest)

    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
