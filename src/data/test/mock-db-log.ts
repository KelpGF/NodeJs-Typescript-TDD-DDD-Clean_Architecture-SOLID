import { LogErrorRepository } from '../protocols/db/log'

export const mockLogErrorRepository = (): LogErrorRepository => {
  class StubLogErrorRepository implements LogErrorRepository {
    async logError (stack: string): Promise<void> {
      return await Promise.resolve()
    }
  }

  return new StubLogErrorRepository()
}
