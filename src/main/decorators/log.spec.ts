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
        return await Promise.resolve(null as unknown as HttpResponse)
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

    expect(spyStubHandle).toHaveBeenLastCalledWith(httpRequest)
  })
})
