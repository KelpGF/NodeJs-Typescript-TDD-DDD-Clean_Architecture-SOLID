import { GetSurveyResultController } from './get-survey-result-controller'
import { forbidden, GetSurveyResult, internalServerError, ok } from './get-survey-result-controller-protocols'
import { SearchSurveyById } from '@/domain/usecases/survey/search-survey-by-id'
import { HttpRequest } from '@/presentation/protocols/http'
import { InvalidParamError } from '@/presentation/errors'
import { mockGetSurveyResult, mockSearchSurveyById } from '@/presentation/test'
import { mockSurveyResultModel } from '@/domain/test'
import MockDate from 'mockdate'

const mockRequest = (): HttpRequest => ({
  accountId: 'any_account_id',
  params: { surveyId: 'any_survey_id' }
})

type SutTypes = {
  sut: GetSurveyResultController
  searchSurveyByIdStub: SearchSurveyById
  getSurveyResultStub: GetSurveyResult
}
const makeSut = (): SutTypes => {
  const searchSurveyByIdStub = mockSearchSurveyById()
  const getSurveyResultStub = mockGetSurveyResult()
  const sut = new GetSurveyResultController(searchSurveyByIdStub, getSurveyResultStub)

  return { sut, searchSurveyByIdStub, getSurveyResultStub }
}

describe('GetSurveyResult Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call SearchSurveyById with correct surveyId', async () => {
    const { sut, searchSurveyByIdStub } = makeSut()
    const searchSpy = jest.spyOn(searchSurveyByIdStub, 'searchById')
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(searchSpy).toHaveBeenCalledWith(httpRequest.params.surveyId)
  })

  test('Should return 403 if SearchSurveyById returns null', async () => {
    const { sut, searchSurveyByIdStub } = makeSut()
    jest.spyOn(searchSurveyByIdStub, 'searchById').mockResolvedValueOnce(null)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  test('Should return 500 if SearchSurveyById throws', async () => {
    const { sut, searchSurveyByIdStub } = makeSut()
    jest.spyOn(searchSurveyByIdStub, 'searchById').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(internalServerError(new Error()))
  })

  test('Should call GetSurveyResult with correct surveyId', async () => {
    const { sut, getSurveyResultStub } = makeSut()
    const searchSpy = jest.spyOn(getSurveyResultStub, 'get')
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(searchSpy).toHaveBeenCalledWith(httpRequest.params.surveyId)
  })

  test('Should return 500 if GetSurveyResult throws', async () => {
    const { sut, getSurveyResultStub } = makeSut()
    jest.spyOn(getSurveyResultStub, 'get').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(internalServerError(new Error()))
  })

  test('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok(mockSurveyResultModel()))
  })
})
