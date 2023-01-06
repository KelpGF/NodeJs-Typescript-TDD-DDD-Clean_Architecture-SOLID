import { DbAddSurvey } from './db-add-survey'
import { InsertSurveyModel, InsertSurveyRepository } from './db-add-survey-protocols'

const makeFakeSurveyData = (): InsertSurveyModel => ({
  question: 'any_question',
  answers: [{
    answer: 'any_answer',
    image: 'any_image'
  }]
})

const makeInsertSurveyRepositoryStub = (): InsertSurveyRepository => {
  class InsertSurveyRepositoryStub implements InsertSurveyRepository {
    async insert (surveyData: InsertSurveyModel): Promise<void> {}
  }

  return new InsertSurveyRepositoryStub()
}

interface SutTypes {
  sut: DbAddSurvey
  insertSurveyRepositoryStub: InsertSurveyRepository
}
const makeSut = (): SutTypes => {
  const insertSurveyRepositoryStub = makeInsertSurveyRepositoryStub()
  const sut = new DbAddSurvey(insertSurveyRepositoryStub)

  return { sut, insertSurveyRepositoryStub }
}

describe('DbAddSurvey UseCase', () => {
  test('Should call InsertSurveyRepository with correct values', async () => {
    const { sut, insertSurveyRepositoryStub } = makeSut()
    const insertSpy = jest.spyOn(insertSurveyRepositoryStub, 'insert')
    const fakeSurveyData = makeFakeSurveyData()
    await sut.add(fakeSurveyData)
    expect(insertSpy).toHaveBeenCalledWith(fakeSurveyData)
  })

  test('Should throw if InsertSurveyRepository throws', async () => {
    const { sut, insertSurveyRepositoryStub } = makeSut()
    jest.spyOn(insertSurveyRepositoryStub, 'insert').mockRejectedValueOnce(new Error())
    const promise = sut.add(makeFakeSurveyData())
    await expect(promise).rejects.toThrow()
  })
})
