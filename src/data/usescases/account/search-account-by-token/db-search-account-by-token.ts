import { SearchAccountByToken, Decrypter, AccountModel, FindAccountByTokenRepository } from './db-search-account-by-token-protocols'

export class DbSearchAccountByToken implements SearchAccountByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly findAccountByTokenRepository: FindAccountByTokenRepository
  ) {}

  async search (accessToken: string, role?: string | undefined): Promise<AccountModel | null> {
    const token = await this.decrypter.decrypt(accessToken)
    if (token) {
      const account = await this.findAccountByTokenRepository.findByToken(accessToken, role)
      if (account) return account
    }
    return null
  }
}
