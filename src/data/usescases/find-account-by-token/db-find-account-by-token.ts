import { FindAccountByToken, Decrypter, AccountModel, FindAccountByTokenRepository } from './db-find-account-by-token-protocols'

export class DbFindAccountByToken implements FindAccountByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly findAccountByTokenRepository: FindAccountByTokenRepository
  ) {}

  async find (accessToken: string, role?: string | undefined): Promise<AccountModel | null> {
    const token = await this.decrypter.decrypt(accessToken)
    if (token) {
      const account = await this.findAccountByTokenRepository.findByToken(accessToken, role)
      if (account) return account
    }
    return null
  }
}
