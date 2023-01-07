import { AccountModel, AddAccount, InsertAccountModel, InsertAccountRepository, Hasher, FindAccountByEmailRepository } from './db-add-account-protocols'

export class DBAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly insertAccountRepository: InsertAccountRepository,
    private readonly findAccountByEmailRepository: FindAccountByEmailRepository
  ) {}

  async add (accountData: InsertAccountModel): Promise<AccountModel | null> {
    const findAccount = await this.findAccountByEmailRepository.findByEmail(accountData.email)
    if (!findAccount) {
      const hashedPassword = await this.hasher.hash(accountData.password)
      const account = await this.insertAccountRepository.insert(Object.assign({}, accountData, { password: hashedPassword }))
      return account
    }

    return null
  }
}
