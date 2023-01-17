import { DbGetSurveyResult } from './db-get-survey-result'
import { FindSurveyResultBySurveyIdRepository, FindSurveyByIdRepository } from './db-get-survey-result-protocols'
import { mockSurveyResultModel } from '@/domain/test'
import { mockFindSurveyByIdRepository, mockFindSurveyResultBySurveyIdRepository } from '@/data/test'
import MockDate from 'mockdate'

type SutTypes = {
  sut: DbGetSurveyResult
  findSurveyResultBySurveyIdRepositoryStub: FindSurveyResultBySurveyIdRepository
  findSurveyByIdRepositoryStub: FindSurveyByIdRepository
}
const makeSut = (): SutTypes => {
  const findSurveyResultBySurveyIdRepositoryStub = mockFindSurveyResultBySurveyIdRepository()
  const findSurveyByIdRepositoryStub = mockFindSurveyByIdRepository()
  const sut = new DbGetSurveyResult(findSurveyResultBySurveyIdRepositoryStub, findSurveyByIdRepositoryStub)

  return { sut, findSurveyResultBySurveyIdRepositoryStub, findSurveyByIdRepositoryStub }
}

describe('DbGetSurveyResult UseCase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call FindSurveyResultBySurveyIdRepository with correct surveyId', async () => {
    const { sut, findSurveyResultBySurveyIdRepositoryStub } = makeSut()
    const findBySurveyIdSpy = jest.spyOn(findSurveyResultBySurveyIdRepositoryStub, 'findBySurveyId')
    await sut.get('any_survey_id')
    expect(findBySurveyIdSpy).toHaveBeenCalledWith('any_survey_id')
  })

  test('Should throw if FindSurveyResultBySurveyIdRepository throws', async () => {
    const { sut, findSurveyResultBySurveyIdRepositoryStub } = makeSut()
    jest.spyOn(findSurveyResultBySurveyIdRepositoryStub, 'findBySurveyId').mockRejectedValueOnce(new Error())
    const promise = sut.get('any_survey_id')
    await expect(promise).rejects.toThrow()
  })

  test('Should call FindSurveyByIdRepository with correct surveyId if FindSurveyResultBySurveyIdRepository returns null', async () => {
    const { sut, findSurveyResultBySurveyIdRepositoryStub, findSurveyByIdRepositoryStub } = makeSut()
    jest.spyOn(findSurveyResultBySurveyIdRepositoryStub, 'findBySurveyId').mockResolvedValueOnce(null)
    const findByIdSpy = jest.spyOn(findSurveyByIdRepositoryStub, 'findById')
    await sut.get('any_survey_id')
    expect(findByIdSpy).toBeCalledWith('any_survey_id')
  })

  test('Should return a surveyResult on success', async () => {
    const { sut } = makeSut()
    const result = await sut.get('any_survey_id')
    expect(result).toEqual(mockSurveyResultModel())
  })
})
