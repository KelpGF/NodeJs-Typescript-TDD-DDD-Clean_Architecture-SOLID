import { AddSurvey, AddSurveyParams, InsertSurveyRepository } from './db-add-survey-protocols'

export class DbAddSurvey implements AddSurvey {
  constructor (
    private readonly insertSurveyRepository: InsertSurveyRepository
  ) {}

  async add (survey: AddSurveyParams): Promise<void> {
    await this.insertSurveyRepository.insert(survey)
  }
}
