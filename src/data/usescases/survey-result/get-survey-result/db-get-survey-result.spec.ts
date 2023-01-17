import { DbGetSurveyResult } from './db-get-survey-result'
import { FindSurveyResultBySurveyIdRepository } from './db-get-survey-result-protocols'
import { mockFindSurveyResultBySurveyIdRepository } from '@/data/test'
import MockDate from 'mockdate'

type SutTypes = {
  sut: DbGetSurveyResult
  findSurveyResultBySurveyIdRepositoryStub: FindSurveyResultBySurveyIdRepository
}
const makeSut = (): SutTypes => {
  const findSurveyResultBySurveyIdRepositoryStub = mockFindSurveyResultBySurveyIdRepository()
  const sut = new DbGetSurveyResult(findSurveyResultBySurveyIdRepositoryStub)

  return { sut, findSurveyResultBySurveyIdRepositoryStub }
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
})
