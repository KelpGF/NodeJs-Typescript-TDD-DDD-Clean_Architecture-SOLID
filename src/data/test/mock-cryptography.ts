import { Decrypter, Encrypter, HashComparer, Hasher } from '@/data/protocols/cryptography'

export const mockHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (value: string): Promise<string> {
      return await Promise.resolve('hashed_password')
    }
  }

  const hasherStub = new HasherStub()

  return hasherStub
}

export const mockHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare (hash: string): Promise<boolean> {
      return true
    }
  }

  return new HashComparerStub()
}

export const mockEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (id: string): Promise<string> {
      return 'valid_token'
    }
  }

  return new EncrypterStub()
}

export const mockDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (token: string): Promise<string | null> {
      return 'any_value'
    }
  }

  return new DecrypterStub()
}
