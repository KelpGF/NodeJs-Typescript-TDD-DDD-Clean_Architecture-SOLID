import MockDate from 'mockdate'
import { ListSurveyController } from './list-surveys-controller'
import { ListSurveys, SurveyModel } from './list-surveys-controller-protocols'
import { internalServerError, noContent, ok } from '@/presentation/helpers/http/http-helper'

const makeFakeSurveys = (): SurveyModel[] => ([
  {
    id: 'any_id',
    question: 'any_question',
    answers: [{ answer: 'any_answer', image: 'any_image' }],
    date: new Date()
  },
  {
    id: 'other_id',
    question: 'other_question',
    answers: [{ answer: 'other_answer' }],
    date: new Date()
  }
])

const makeListSurveyStub = (): ListSurveys => {
  class ListSurveyStub implements ListSurveys {
    async list (): Promise<SurveyModel[]> {
      return makeFakeSurveys()
    }
  }

  return new ListSurveyStub()
}

interface SutTypes {
  sut: ListSurveyController
  listSurveyStub: ListSurveys
}
const makeSut = (): SutTypes => {
  const listSurveyStub = makeListSurveyStub()
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
    expect(httpResponse).toEqual(ok(makeFakeSurveys()))
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
