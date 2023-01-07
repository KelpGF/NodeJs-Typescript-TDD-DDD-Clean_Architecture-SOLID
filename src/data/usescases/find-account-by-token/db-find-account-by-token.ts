import { FindAccountByToken, Decrypter, AccountModel, FindAccountByTokenRepository } from './db-find-account-by-token-protocol'

export class DbFindAccountByToken implements FindAccountByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly findAccountByTokenRepository: FindAccountByTokenRepository
  ) {}

  async find (accessToken: string, role?: string | undefined): Promise<AccountModel | null> {
    const token = await this.decrypter.decrypt(accessToken)
    if (token) {
      await this.findAccountByTokenRepository.findByToken(token, role)
    }
    return null
  }
}
