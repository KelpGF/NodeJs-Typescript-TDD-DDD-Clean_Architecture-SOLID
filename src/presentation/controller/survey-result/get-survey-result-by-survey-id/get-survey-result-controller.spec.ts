import { GetSurveyResult } from './get-survey-result-controller'
import { forbidden, internalServerError } from './get-survey-result-controller-protocols'
import { SearchSurveyById } from '@/domain/usecases/survey/search-survey-by-id'
import { HttpRequest } from '@/presentation/protocols/http'
import { InvalidParamError } from '@/presentation/errors'
import { mockSearchSurveyById } from '@/presentation/test'

const mockRequest = (): HttpRequest => ({
  accountId: 'any_account_id',
  params: { surveyId: 'any_survey_id' }
})

type SutTypes = {
  sut: GetSurveyResult
  searchSurveyByIdStub: SearchSurveyById
}
const makeSut = (): SutTypes => {
  const searchSurveyByIdStub = mockSearchSurveyById()
  const sut = new GetSurveyResult(searchSurveyByIdStub)

  return { sut, searchSurveyByIdStub }
}

describe('GetSurveyResult Controller', () => {
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
})
