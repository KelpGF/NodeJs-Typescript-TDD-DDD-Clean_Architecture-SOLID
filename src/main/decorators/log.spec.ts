import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

describe('Log Controller Decorator', () => {
  interface SutTypes {
    sut: Controller
    stubController: Controller
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
  const makeSut = (): SutTypes => {
    const stubController = makeStubController()
    const sut = new LogControllerDecorator(stubController)

    return { sut, stubController }
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
})
