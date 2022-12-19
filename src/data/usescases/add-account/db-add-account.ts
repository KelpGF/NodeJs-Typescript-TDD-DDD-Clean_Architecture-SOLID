import { AccountModel, AddAccount, AddAccountModel, AddAccountRepository, Encrypter } from './db-add-account-protocol'

export class DBAddAccount implements AddAccount {
  private readonly encrypter: Encrypter
  private readonly addAccountRepository: AddAccountRepository

  constructor (encrypter: Encrypter, addAccountRepository: AddAccountRepository) {
    this.encrypter = encrypter
    this.addAccountRepository = addAccountRepository
  }

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.encrypt(accountData.password)

    console.log(hashedPassword)
    await this.addAccountRepository.add(Object.assign({}, accountData, { password: hashedPassword }))

    return await Promise.resolve({ email: accountData.email, name: accountData.name, id: 'valid_id', password: hashedPassword })
  }
}
