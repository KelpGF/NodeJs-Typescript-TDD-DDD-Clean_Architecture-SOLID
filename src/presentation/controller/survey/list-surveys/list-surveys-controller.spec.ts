import MockDate from 'mockdate'
import { ListSurveyController } from './list-surveys-controller'
import { ListSurveys } from './list-surveys-controller-protocols'
import { internalServerError, noContent, ok } from '@/presentation/helpers/http/http-helper'
import { mockSurveyModelList } from '@/domain/test'
import { mockListSurveys } from '@/presentation/test'

type SutTypes = {
  sut: ListSurveyController
  listSurveyStub: ListSurveys
}
const makeSut = (): SutTypes => {
  const listSurveyStub = mockListSurveys()
  const sut = new ListSurveyController(listSurveyStub)

  return { sut, listSurveyStub }
}

describe('ListSurveys Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call ListSurveys', async () => {
    const { sut, listSurveyStub } = makeSut()
    const listSpy = jest.spyOn(listSurveyStub, 'list')
    await sut.handle({})
    expect(listSpy).toHaveBeenCalled()
  })

  test('Should return 200 on succeeds', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(ok(mockSurveyModelList()))
  })

  test('Should return 204 on if ListSurveys returns empty', async () => {
    const { sut, listSurveyStub } = makeSut()
    jest.spyOn(listSurveyStub, 'list').mockResolvedValueOnce([])
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(noContent())
  })

  test('Should return 500 if ListSurveys throws', async () => {
    const { sut, listSurveyStub } = makeSut()
    jest.spyOn(listSurveyStub, 'list').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(internalServerError(new Error()))
  })
})
