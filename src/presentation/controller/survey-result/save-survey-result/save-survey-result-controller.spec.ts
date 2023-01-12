import {
  forbidden,
  HttpRequest,
  internalServerError,
  SaveSurveyResult,
  SaveSurveyResultModel,
  SearchSurveyById,
  SurveyModel,
  SurveyResultModel
} from './save-survey-result-controller-protocols'
import { SaveSurveyResultController } from './save-survey-result-controller'
import { InvalidParamError } from '@/presentation/errors'
import MockDate from 'mockdate'

const makeFakeRequest = (): HttpRequest => ({
  params: { surveyId: 'any_survey_id' },
  body: { answer: 'any_answer' },
  accountId: 'any_account_id'
})

const makeFakeSurveyResult = (): SurveyResultModel => ({
  id: 'any_survey_result_id',
  surveyId: 'any_survey',
  accountId: 'any_account',
  answer: 'any_answer',
  date: new Date()
})

const makeFakeSurvey = (): SurveyModel => (
  {
    id: 'any_survey_id',
    question: 'any_question',
    answers: [{ answer: 'any_answer', image: 'any_image' }],
    date: new Date()
  }
)

const makeSearchSurveyByIdStub = (): SearchSurveyById => {
  class SearchSurveyByIdStub implements SearchSurveyById {
    async searchById (id: string): Promise<SurveyModel | null> {
      return makeFakeSurvey()
    }
  }

  return new SearchSurveyByIdStub()
}

const makeSaveSurveyResultStub = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
      return makeFakeSurveyResult()
    }
  }

  return new SaveSurveyResultStub()
}

type SutTypes = {
  sut: SaveSurveyResultController
  searchSurveyByIdStub: SearchSurveyById
  saveSurveyResultStub: SaveSurveyResult
}

const makeSut = (): SutTypes => {
  const searchSurveyByIdStub = makeSearchSurveyByIdStub()
  const saveSurveyResultStub = makeSaveSurveyResultStub()
  const sut = new SaveSurveyResultController(searchSurveyByIdStub, saveSurveyResultStub)

  return { sut, searchSurveyByIdStub, saveSurveyResultStub }
}

describe('SaveSurveyResultController', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call SearchSurveyById with correct values', async () => {
    const { sut, searchSurveyByIdStub } = makeSut()
    const searchByIdSpy = jest.spyOn(searchSurveyByIdStub, 'searchById')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(searchByIdSpy).toHaveBeenCalledWith(httpRequest.params?.surveyId)
  })

  test('Should return 403 if SearchSurveyById returns null', async () => {
    const { sut, searchSurveyByIdStub } = makeSut()
    jest.spyOn(searchSurveyByIdStub, 'searchById').mockResolvedValueOnce(null)
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  test('Should return 500 if SearchSurveyById throws', async () => {
    const { sut, searchSurveyByIdStub } = makeSut()
    jest.spyOn(searchSurveyByIdStub, 'searchById').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(internalServerError(new Error()))
  })

  test('Should return 403 if an invalid answer is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({ body: { answer: 'wrong_answer' } })
    expect(httpResponse).toEqual(forbidden(new InvalidParamError('answer')))
  })

  test('Should call SaveSurveyResult with correct values', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultStub, 'save')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(saveSpy).toHaveBeenCalledWith({
      accountId: 'any_account_id',
      surveyId: 'any_survey_id',
      answer: 'any_answer',
      date: new Date()
    })
  })
})
