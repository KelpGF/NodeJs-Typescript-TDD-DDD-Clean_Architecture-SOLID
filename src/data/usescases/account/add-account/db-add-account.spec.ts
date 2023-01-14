import { mockAccountModel, mockAddAccountParams } from '@/domain/test'
import { mockAddAccountRepository, mockFindAccountByEmailRepository, mockHasher } from '@/data/test'
import { AddAccount, InsertAccountRepository, Hasher, FindAccountByEmailRepository } from './db-add-account-protocols'
import { DBAddAccount } from './db-add-account'

type SutTypes = {
  sut: AddAccount
  hasherStub: Hasher
  insertAccountRepositoryStub: InsertAccountRepository
  findAccountByEmailRepositoryStub: FindAccountByEmailRepository
}
const makeSut = (): SutTypes => {
  const hasherStub = mockHasher()
  const insertAccountRepositoryStub = mockAddAccountRepository()
  const findAccountByEmailRepositoryStub = mockFindAccountByEmailRepository()
  jest.spyOn(findAccountByEmailRepositoryStub, 'findByEmail').mockResolvedValue(null)
  const sut = new DBAddAccount(hasherStub, insertAccountRepositoryStub, findAccountByEmailRepositoryStub)

  return { sut, hasherStub, insertAccountRepositoryStub, findAccountByEmailRepositoryStub }
}

describe('DBAddAccount UseCase', () => {
  test('Should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut()
    const hashSpy = jest.spyOn(hasherStub, 'hash')
    const accountData = mockAddAccountParams()

    await sut.add(accountData)
    expect(hashSpy).toHaveBeenCalledWith(accountData.password)
  })

  test('Should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hash').mockRejectedValueOnce(new Error())
    const promise = sut.add(mockAddAccountParams())

    await expect(promise).rejects.toThrow()
  })

  test('Should call InsertAccountRepository with correct data', async () => {
    const { sut, insertAccountRepositoryStub } = makeSut()
    const insertSpy = jest.spyOn(insertAccountRepositoryStub, 'insert')
    const accountData = mockAddAccountParams()

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
    const promise = sut.add(mockAddAccountParams())

    await expect(promise).rejects.toThrow()
  })

  test('Should return an account on success', async () => {
    const { sut } = makeSut()
    const account = await sut.add(mockAddAccountParams())

    expect(account).toEqual(mockAccountModel())
  })

  test('Should call FindAccountByEmailRepository if correct email', async () => {
    const { sut, findAccountByEmailRepositoryStub } = makeSut()
    const findByEmailSpy = jest.spyOn(findAccountByEmailRepositoryStub, 'findByEmail').mockResolvedValueOnce(mockAccountModel())
    const fakeAddAccountData = mockAddAccountParams()
    await sut.add(fakeAddAccountData)
    expect(findByEmailSpy).toHaveBeenCalledWith(fakeAddAccountData.email)
  })

  test('Should return null if FindAccountByEmailRepository not returns null', async () => {
    const { sut, findAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(findAccountByEmailRepositoryStub, 'findByEmail').mockResolvedValueOnce(mockAccountModel())
    const result = await sut.add(mockAddAccountParams())
    expect(result).toBeNull()
  })
})
