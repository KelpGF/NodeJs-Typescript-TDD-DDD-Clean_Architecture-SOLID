import bcrypt from 'bcrypt'
import { Hasher } from '../../data/protocols/cryptography/hasher'

export class BcryptAdapter implements Hasher {
  private readonly salt: number

  constructor (salt: number) {
    this.salt = salt
  }

  async hash (value: string): Promise<string> {
    return await bcrypt.hash(value, this.salt)
  }
}
