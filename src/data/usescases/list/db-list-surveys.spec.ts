import { FindSurveysRepository, SurveyModel } from './db-list-surveys-protocols'
import { DbListSurveys } from './db-list-surveys'

const makeFakeSurveys = (): SurveyModel[] => ([
  {
    id: 'any_id',
    question: 'any_question',
    answers: [{ answer: 'any_answer', image: 'any_image' }],
    date: new Date()
  },
  {
    id: 'other_id',
    question: 'other_question',
    answers: [{ answer: 'other_answer' }],
    date: new Date()
  }
])

const makeFindSurveysRepositoryStub = (): FindSurveysRepository => {
  class FindSurveysRepositoryStub implements FindSurveysRepository {
    async findAll (): Promise<SurveyModel[]> {
      return makeFakeSurveys()
    }
  }

  return new FindSurveysRepositoryStub()
}

interface SutTypes {
  sut: DbListSurveys
  findSurveysRepositoryStub: FindSurveysRepository
}

const makeSut = (): SutTypes => {
  const findSurveysRepositoryStub = makeFindSurveysRepositoryStub()
  const sut = new DbListSurveys(findSurveysRepositoryStub)

  return { sut, findSurveysRepositoryStub }
}

describe('DbListSurveys UseCase', () => {
  test('Should call FindSurveysRepository', async () => {
    const { sut, findSurveysRepositoryStub } = makeSut()
    const findAllSpy = jest.spyOn(findSurveysRepositoryStub, 'findAll')
    await sut.list()
    expect(findAllSpy).toHaveBeenCalled()
  })
})
