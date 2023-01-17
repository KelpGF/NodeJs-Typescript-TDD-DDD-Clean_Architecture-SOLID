import { mockSaveSurveyResultRepository, mockFindSurveyResultBySurveyIdRepository } from '@/data/test/mock-db-survey-result'
import { mockSaveSurveyResultParams, mockSurveyResultModel } from '@/domain/test'
import { DbSaveSurveyResult } from './db-save-survey-result'
import { SaveSurveyResultRepository, FindSurveyResultBySurveyIdRepository } from './db-save-survey-result-protocols'
import MockDate from 'mockdate'

type SutTypes = {
  sut: DbSaveSurveyResult
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
  findSurveyResultBySurveyIdRepositoryStub: FindSurveyResultBySurveyIdRepository
}
const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = mockSaveSurveyResultRepository()
  const findSurveyResultBySurveyIdRepositoryStub = mockFindSurveyResultBySurveyIdRepository()
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub, findSurveyResultBySurveyIdRepositoryStub)

  return { sut, saveSurveyResultRepositoryStub, findSurveyResultBySurveyIdRepositoryStub }
}

describe('DbSaveSurveyResult', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call SaveSurveyResultRepository with correct values', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultRepositoryStub, 'save')
    const saveSurveyResultData = mockSaveSurveyResultParams()
    await sut.save(saveSurveyResultData)
    expect(saveSpy).toBeCalledWith(saveSurveyResultData)
  })

  test('Should throw if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockRejectedValueOnce(new Error())
    const promise = sut.save(mockSaveSurveyResultParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should call FindSurveyResultBySurveyIdRepository with correct values', async () => {
    const { sut, findSurveyResultBySurveyIdRepositoryStub } = makeSut()
    const findBySurveyIdSpy = jest.spyOn(findSurveyResultBySurveyIdRepositoryStub, 'findBySurveyId')
    const saveSurveyResultData = mockSaveSurveyResultParams()
    await sut.save(saveSurveyResultData)
    expect(findBySurveyIdSpy).toBeCalledWith(saveSurveyResultData.surveyId)
  })

  test('Should throw if FindSurveyResultBySurveyIdRepository throws', async () => {
    const { sut, findSurveyResultBySurveyIdRepositoryStub } = makeSut()
    jest.spyOn(findSurveyResultBySurveyIdRepositoryStub, 'findBySurveyId').mockRejectedValueOnce(new Error())
    const promise = sut.save(mockSaveSurveyResultParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should return surveyResult on success', async () => {
    const { sut } = makeSut()
    const surveyResult = await sut.save(mockSaveSurveyResultParams())
    expect(surveyResult).toEqual(mockSurveyResultModel())
  })
})
