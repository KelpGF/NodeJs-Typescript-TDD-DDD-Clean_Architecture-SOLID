import { AccountModel, AddAccount, InsertAccountModel, InsertAccountRepository, Hasher } from './db-add-account-protocols'
import { DBAddAccount } from './db-add-account'
import { FindAccountByEmailRepository } from '../authentication/db-authentication-protocols'

const makeHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (value: string): Promise<string> {
      return await Promise.resolve('hashed_password')
    }
  }

  const hasherStub = new HasherStub()

  return hasherStub
}
const makeAddAccountRepository = (): InsertAccountRepository => {
  class InsertAccountRepositoryStub implements InsertAccountRepository {
    async insert (account: InsertAccountModel): Promise<AccountModel> {
      return await Promise.resolve(makeFakeAccount())
    }
  }

  const insertAccountRepositoryStub = new InsertAccountRepositoryStub()

  return insertAccountRepositoryStub
}
const makeFindAccountByEmailRepositoryStub = (): FindAccountByEmailRepository => {
  class FindAccountByEmailRepositoryStub implements FindAccountByEmailRepository {
    async findByEmail (email: string): Promise<AccountModel | null> {
      return null
    }
  }

  return new FindAccountByEmailRepositoryStub()
}
const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_pass'
})
const makeFakeAddAccountData = (): InsertAccountModel => ({
  email: 'valid_email@gmail.com',
  name: 'valid_name',
  password: 'valid_password'
})

type SutTypes = {
  sut: AddAccount
  hasherStub: Hasher
  insertAccountRepositoryStub: InsertAccountRepository
  findAccountByEmailRepositoryStub: FindAccountByEmailRepository
}
const makeSut = (): SutTypes => {
  const hasherStub = makeHasher()
  const insertAccountRepositoryStub = makeAddAccountRepository()
  const findAccountByEmailRepositoryStub = makeFindAccountByEmailRepositoryStub()
  const sut = new DBAddAccount(hasherStub, insertAccountRepositoryStub, findAccountByEmailRepositoryStub)

  return { sut, hasherStub, insertAccountRepositoryStub, findAccountByEmailRepositoryStub }
}

describe('DBAddAccount UseCase', () => {
  test('Should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut()
    const hashSpy = jest.spyOn(hasherStub, 'hash')
    const accountData = makeFakeAddAccountData()

    await sut.add(accountData)
    expect(hashSpy).toHaveBeenCalledWith(accountData.password)
  })

  test('Should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hash').mockRejectedValueOnce(new Error())
    const promise = sut.add(makeFakeAddAccountData())

    await expect(promise).rejects.toThrow()
  })

  test('Should call InsertAccountRepository with correct data', async () => {
    const { sut, insertAccountRepositoryStub } = makeSut()
    const insertSpy = jest.spyOn(insertAccountRepositoryStub, 'insert')
    const accountData = makeFakeAddAccountData()

    await sut.add(accountData)
    expect(insertSpy).toHaveBeenCalledWith({
      email: accountData.email,
      name: accountData.name,
      password: 'hashed_password'
    })
  })

  test('Should throw if InsertAccountRepository throws', async () => {
    const { sut, insertAccountRepositoryStub } = makeSut()
    jest.spyOn(insertAccountRepositoryStub, 'insert').mockRejectedValueOnce(new Error())
    const promise = sut.add(makeFakeAddAccountData())

    await expect(promise).rejects.toThrow()
  })

  test('Should return an account on success', async () => {
    const { sut } = makeSut()
    const account = await sut.add(makeFakeAddAccountData())

    expect(account).toEqual(makeFakeAccount())
  })

  test('Should call FindAccountByEmailRepository if correct email', async () => {
    const { sut, findAccountByEmailRepositoryStub } = makeSut()
    const findByEmailSpy = jest.spyOn(findAccountByEmailRepositoryStub, 'findByEmail').mockResolvedValueOnce(makeFakeAccount())
    const fakeAddAccountData = makeFakeAddAccountData()
    await sut.add(fakeAddAccountData)
    expect(findByEmailSpy).toHaveBeenCalledWith(fakeAddAccountData.email)
  })

  test('Should return null if FindAccountByEmailRepository not returns null', async () => {
    const { sut, findAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(findAccountByEmailRepositoryStub, 'findByEmail').mockResolvedValueOnce(makeFakeAccount())
    const result = await sut.add(makeFakeAddAccountData())
    expect(result).toBeNull()
  })
})
