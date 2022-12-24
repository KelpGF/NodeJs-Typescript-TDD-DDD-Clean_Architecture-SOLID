import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

describe('Log Controller Decorator', () => {
  test('Should LogControllerDecorator calls controller handle with correct value', async () => {
    class StubController implements Controller {
      async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
        return await Promise.resolve(null as unknown as HttpResponse)
      }
    }

    const stubController = new StubController()
    const spyStubHandle = jest.spyOn(stubController, 'handle')
    const sut = new LogControllerDecorator(stubController)
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
