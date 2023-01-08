import { ListSurveyController } from './list-surveys-controller'
import { ListSurvey, SurveyModel } from './list-surveys-controller-protocols'
import MockDate from 'mockdate'
import { ok } from '../../../helpers/http/http-helper'

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

const makeListSurveyStub = (): ListSurvey => {
  class ListSurveyStub implements ListSurvey {
    async list (): Promise<SurveyModel[]> {
      return makeFakeSurveys()
    }
  }

  return new ListSurveyStub()
}

interface SutTypes {
  sut: ListSurveyController
  listSurveyStub: ListSurvey
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
})
