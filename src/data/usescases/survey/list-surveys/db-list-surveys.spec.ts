import { FindSurveysRepository } from './db-list-surveys-protocols'
import { DbListSurveys } from './db-list-surveys'
import MockDate from 'mockdate'
import { mockFindSurveysRepository } from '@/data/test'
import { mockSurveyModelList } from '@/domain/test'

type SutTypes = {
  sut: DbListSurveys
  findSurveysRepositoryStub: FindSurveysRepository
}

const makeSut = (): SutTypes => {
  const findSurveysRepositoryStub = mockFindSurveysRepository()
  const sut = new DbListSurveys(findSurveysRepositoryStub)

  return { sut, findSurveysRepositoryStub }
}

describe('DbListSurveys UseCase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call FindSurveysRepository', async () => {
    const { sut, findSurveysRepositoryStub } = makeSut()
    const findAllSpy = jest.spyOn(findSurveysRepositoryStub, 'findAll')
    await sut.list()
    expect(findAllSpy).toHaveBeenCalled()
  })

  test('Should return a list of Surveys on succeeds', async () => {
    const { sut } = makeSut()
    const surveys = await sut.list()
    expect(surveys).toEqual(mockSurveyModelList())
  })

  test('Should throw if FindSurveysRepository throws', async () => {
    const { sut, findSurveysRepositoryStub } = makeSut()
    jest.spyOn(findSurveysRepositoryStub, 'findAll').mockRejectedValueOnce(new Error())
    const promise = sut.list()
    await expect(promise).rejects.toThrow()
  })
})
