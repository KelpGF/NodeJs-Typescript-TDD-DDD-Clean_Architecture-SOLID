import MockDate from 'mockdate'
import { DbSearchSurveyById } from './db-search-survey-by-id'
import { SurveyModel, FindSurveyByIdRepository } from './db-search-survey-by-id-protocols'

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

  test('Should return a survey on success', async () => {
    const { sut } = makeSut()
    const survey = await sut.searchById('any_id')
    expect(survey).toEqual(makeFakeSurvey())
  })

  test('Should throw if FindSurveyByIdRepository throws', async () => {
    const { sut, findSurveyByIdRepositoryStub } = makeSut()
    jest.spyOn(findSurveyByIdRepositoryStub, 'findById').mockRejectedValueOnce(new Error(''))
    const promise = sut.searchById('any_id')
    await expect(promise).rejects.toThrow()
  })
})
