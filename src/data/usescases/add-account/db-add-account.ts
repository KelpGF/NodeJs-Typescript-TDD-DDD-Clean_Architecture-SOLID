import { AccountModel, AddAccount, AddAccountModel, Encrypter } from './db-add-account-protocol'

export class DBAddAccount implements AddAccount {
  private readonly encrypter: Encrypter

  constructor (encrypter: Encrypter) {
    this.encrypter = encrypter
  }

  async add (account: AddAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(account.password)

    return await Promise.resolve({ ...account, id: 'valid_id' })
  }
}
