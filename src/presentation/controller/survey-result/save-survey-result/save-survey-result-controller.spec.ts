import { forbidden, HttpRequest, SearchSurveyById, SurveyModel } from './save-survey-result-controller-protocols'
import { SaveSurveyResultController } from './save-survey-result-controller'
import MockDate from 'mockdate'
import { InvalidParamError } from '@/presentation/errors'

const makeFakeRequest = (): HttpRequest => ({
  params: { surveyId: 'any_survey_id' }
})

const makeFakeSurvey = (): SurveyModel => (
  {
    id: 'any_id',
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

type SutTypes = {
  sut: SaveSurveyResultController
  searchSurveyByIdStub: SearchSurveyById
}

const makeSut = (): SutTypes => {
  const searchSurveyByIdStub = makeSearchSurveyByIdStub()
  const sut = new SaveSurveyResultController(searchSurveyByIdStub)

  return { sut, searchSurveyByIdStub }
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
    jest.spyOn(searchSurveyByIdStub, 'searchById').mockResolvedValue(null)
    const HttpResponse = await sut.handle(makeFakeRequest())
    expect(HttpResponse).toEqual(forbidden(new InvalidParamError('surveyId')))
  })
})
