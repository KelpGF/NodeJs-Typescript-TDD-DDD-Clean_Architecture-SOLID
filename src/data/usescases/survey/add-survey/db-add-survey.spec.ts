import { mockInsertSurveyRepository } from '@/data/test'
import { DbAddSurvey } from './db-add-survey'
import { InsertSurveyRepository } from './db-add-survey-protocols'
import MockDate from 'mockdate'
import { mockAddSurveyParams } from '@/domain/test'

type SutTypes = {
  sut: DbAddSurvey
  insertSurveyRepositoryStub: InsertSurveyRepository
}
const makeSut = (): SutTypes => {
  const insertSurveyRepositoryStub = mockInsertSurveyRepository()
  const sut = new DbAddSurvey(insertSurveyRepositoryStub)

  return { sut, insertSurveyRepositoryStub }
}

describe('DbAddSurvey UseCase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call InsertSurveyRepository with correct values', async () => {
    const { sut, insertSurveyRepositoryStub } = makeSut()
    const insertSpy = jest.spyOn(insertSurveyRepositoryStub, 'insert')
    const fakeSurveyData = mockAddSurveyParams()
    await sut.add(fakeSurveyData)
    expect(insertSpy).toHaveBeenCalledWith(fakeSurveyData)
  })

  test('Should throw if InsertSurveyRepository throws', async () => {
    const { sut, insertSurveyRepositoryStub } = makeSut()
    jest.spyOn(insertSurveyRepositoryStub, 'insert').mockRejectedValueOnce(new Error())
    const promise = sut.add(mockAddSurveyParams())
    await expect(promise).rejects.toThrow()
  })
})
