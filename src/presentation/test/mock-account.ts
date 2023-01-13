import { mockAccountModel } from '@/domain/test'
import { AccountModel } from '@/domain/models/account'
import { AddAccount, AddAccountParams } from '@/domain/usecases/account/add-account'
import { SearchAccountByToken } from '@/domain/usecases/account/search-account-by-token'
import { Authentication, AuthenticationParams } from '@/domain/usecases/account/authentication'

export const mockAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authentication: AuthenticationParams): Promise<string> {
      return 'any_token'
    }
  }

  return new AuthenticationStub()
}

export const mockAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountParams): Promise<AccountModel> {
      return await Promise.resolve(mockAccountModel())
    }
  }

  return new AddAccountStub()
}

export const mockSearchAccountByToken = (): SearchAccountByToken => {
  class SearchAccountByTokenStub implements SearchAccountByToken {
    async search (accessToken: string): Promise<AccountModel | null> {
      return mockAccountModel()
    }
  }

  return new SearchAccountByTokenStub()
}
