import { AddSurvey, InsertSurveyModel, InsertSurveyRepository } from './db-add-survey-protocols'

export class DbAddSurvey implements AddSurvey {
  constructor (
    private readonly insertSurveyRepository: InsertSurveyRepository
  ) {}

  async add (survey: InsertSurveyModel): Promise<void> {
    await this.insertSurveyRepository.insert(survey)
  }
}
