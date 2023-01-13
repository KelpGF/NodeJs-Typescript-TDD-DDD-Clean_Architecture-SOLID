import { AccountModel } from '@/domain/models/account'
import { AddAccountParams } from '@/domain/usecases/account/add-account'
import { mockAccountModel } from '@/domain/test'
import { FindAccountByEmailRepository, FindAccountByTokenRepository, InsertAccountRepository, UpdateAccessTokenRepository } from '@/data/protocols/db/account'

export const mockAddAccountRepository = (): InsertAccountRepository => {
  class InsertAccountRepositoryStub implements InsertAccountRepository {
    async insert (account: AddAccountParams): Promise<AccountModel> {
      return await Promise.resolve(mockAccountModel())
    }
  }

  const insertAccountRepositoryStub = new InsertAccountRepositoryStub()

  return insertAccountRepositoryStub
}

export const mockFindAccountByEmailRepository = (): FindAccountByEmailRepository => {
  class FindAccountByEmailRepositoryStub implements FindAccountByEmailRepository {
    async findByEmail (email: string): Promise<AccountModel | null> {
      return mockAccountModel()
    }
  }

  return new FindAccountByEmailRepositoryStub()
}

export const mockFindAccountByTokenRepository = (): FindAccountByTokenRepository => {
  class FindAccountByTokenRepositoryStub implements FindAccountByTokenRepository {
    async findByToken (token: string): Promise<AccountModel | null> {
      return mockAccountModel()
    }
  }

  return new FindAccountByTokenRepositoryStub()
}

export const mockUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateAccessToken (id: string, accessToken: string): Promise<void> {
      return await Promise.resolve()
    }
  }

  return new UpdateAccessTokenRepositoryStub()
}
