import MockDate from 'mockdate'
import { DbSearchSurveyById } from './db-search-survey-by-id'
import { SurveyModel } from '@/domain/models/survey'
import { FindSurveyByIdRepository } from '@/data/protocols/db/survey/find-survey-by-id-repository'

const makeFakeSurvey = (): SurveyModel => ({
  id: 'any_id',
  question: 'any_question',
  answers: [{ answer: 'any_answer', image: 'any_image' }],
  date: new Date()
})

const makeFindSurveyByIdRepositoryStub = (): FindSurveyByIdRepository => {
  class FindSurveyByIdRepositoryStub implements FindSurveyByIdRepository {
    async findById (): Promise<SurveyModel> {
      return makeFakeSurvey()
    }
  }

  return new FindSurveyByIdRepositoryStub()
}

type SutTypes = {
  findSurveyByIdRepositoryStub: FindSurveyByIdRepository
  sut: DbSearchSurveyById
}

const makeSut = (): SutTypes => {
  const findSurveyByIdRepositoryStub = makeFindSurveyByIdRepositoryStub()
  const sut = new DbSearchSurveyById(findSurveyByIdRepositoryStub)

  return { sut, findSurveyByIdRepositoryStub }
}

describe('DbSearchSurveyById', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call FindSurveyByIdRepository with correct id', async () => {
    const { sut, findSurveyByIdRepositoryStub } = makeSut()
    const findByIdSpy = jest.spyOn(findSurveyByIdRepositoryStub, 'findById')
    await sut.searchById('any_id')
    expect(findByIdSpy).toHaveBeenCalledWith('any_id')
  })
})
