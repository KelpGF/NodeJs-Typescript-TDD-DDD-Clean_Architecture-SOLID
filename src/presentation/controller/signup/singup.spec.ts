import { SignUpController } from './signup'
import { Controller, Validation, AccountModel, AddAccount, AddAccountModel, HttpRequest } from './signup-protocols'
import { MissingParamError, InternalServerError } from './../../errors'
import { badRequest, internalServerError, ok } from '../../helpers/http/http-helper'

const makeAddAccountStub = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      return await Promise.resolve(makeFakeAccount())
    }
  }

  return new AddAccountStub()
}
const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): null | Error {
      return null
    }
  }

  return new ValidationStub()
}
const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_pass'
})

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_pass',
    passwordConfirmation: 'any_pass'
  }
})

interface SutTypes {
  sut: Controller
  addAccountStub: AddAccount
  validationStub: Validation
}
const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccountStub()
  const validationStub = makeValidationStub()
  const sut = new SignUpController(addAccountStub, validationStub)

  return { sut, addAccountStub, validationStub }
}

describe('SignUp Controller', () => {
  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()

    const addSpy = jest.spyOn(addAccountStub, 'add')

    await sut.handle(makeFakeRequest())
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_pass'
    })
  })

  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementation(async () => {
      return await Promise.reject(new Error())
    })
    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(internalServerError(new InternalServerError('')))
  })

  test('Should returns 200 if valid data provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok(makeFakeAccount()))
  })

  test('Should call Validation with correct value', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()

    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 400 if Validation return an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })

  test('Should return 500 if Validation throws', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(internalServerError(new Error()))
  })
})
