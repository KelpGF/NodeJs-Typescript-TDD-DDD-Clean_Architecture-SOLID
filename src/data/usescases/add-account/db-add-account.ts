import { FindAccountByEmailRepository } from '../authentication/db-authentication-protocols'
import { AccountModel, AddAccount, AddAccountModel, AddAccountRepository, Hasher } from './db-add-account-protocols'

export class DBAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly findAccountByEmailRepository: FindAccountByEmailRepository
  ) {}

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    await this.findAccountByEmailRepository.findByEmail(accountData.email)

    const hashedPassword = await this.hasher.hash(accountData.password)
    const account = await this.addAccountRepository.add(Object.assign({}, accountData, { password: hashedPassword }))
    return account
  }
}
