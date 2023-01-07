import { DbFindAccountByToken } from './db-find-account-by-token'
import { Decrypter } from '../../protocols/cryptography/decrypter'

const makeDecrypterStub = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (value: string): Promise<any> {}
  }

  return new DecrypterStub()
}

interface SutTypes {
  sut: DbFindAccountByToken
  decrypter: Decrypter
}
const makeSut = (): SutTypes => {
  const decrypter = makeDecrypterStub()
  const sut = new DbFindAccountByToken(decrypter)

  return { sut, decrypter }
}

describe('DbFindAccountByToken UseCase', () => {
  test('Should call Decrypter with correct values', async () => {
    const { sut, decrypter } = makeSut()
    const decryptSpy = jest.spyOn(decrypter, 'decrypt')
    await sut.find('any_token')
    expect(decryptSpy).toHaveBeenCalledWith('any_token')
  })
})
