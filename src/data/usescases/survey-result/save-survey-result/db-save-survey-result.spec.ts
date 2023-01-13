import MockDate from 'mockdate'
import { DbSaveSurveyResult } from './db-save-survey-result'
import { SurveyResultModel, SaveSurveyResultParams, SaveSurveyResultRepository } from './db-save-survey-result-protocols'

const makeFakeSaveSurveyResultData = (): SaveSurveyResultParams => ({
  surveyId: 'any_survey',
  accountId: 'any_account',
  answer: 'any_answer',
  date: new Date()
})
const makeFakeSurveyResult = (): SurveyResultModel => Object.assign({}, makeFakeSaveSurveyResultData(), { id: 'any_id' })

const makeSaveSurveyResultRepositoryStub = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save (surveyResult: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return makeFakeSurveyResult()
    }
  }

  return new SaveSurveyResultRepositoryStub()
}

type SutTypes = {
  sut: DbSaveSurveyResult
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
}
const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = makeSaveSurveyResultRepositoryStub()
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub)

  return { sut, saveSurveyResultRepositoryStub }
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
    const saveSurveyResultData = makeFakeSaveSurveyResultData()
    await sut.save(saveSurveyResultData)
    expect(saveSpy).toBeCalledWith(saveSurveyResultData)
  })

  test('Should throw if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockRejectedValueOnce(new Error())
    const promise = sut.save(makeFakeSaveSurveyResultData())
    await expect(promise).rejects.toThrow()
  })

  test('Should return surveyResult on success', async () => {
    const { sut } = makeSut()
    const surveyResult = await sut.save(makeFakeSaveSurveyResultData())
    expect(surveyResult).toEqual(makeFakeSurveyResult())
  })
})
