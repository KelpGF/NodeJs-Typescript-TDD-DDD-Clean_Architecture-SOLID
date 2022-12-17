import { MissingParamError } from '../errors/missing-params-error'
import { Controller } from '../protocol/controller'
import { SignUpController } from './signup'

const makeSut = (): Controller => new SignUpController()

describe('SignUp Controller', () => {
  test('Should return 400 if no name provided', () => {
    const sut = makeSut()

    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_pass',
        passwordConfirmation: 'any_pass'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  test('Should return 400 if no email provided', () => {
    const sut = makeSut()

    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_pass',
        passwordConfirmation: 'any_pass'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('Should return 400 if no password provided', () => {
    const sut = makeSut()

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        passwordConfirmation: 'any_pass'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('Should return 400 if no password confirmation provided', () => {
    const sut = new SignUpController()

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_pass'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
  })
})
