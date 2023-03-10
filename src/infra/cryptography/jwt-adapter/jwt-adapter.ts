import jwt from 'jsonwebtoken'
import { Decrypter, Encrypter } from '@/data/protocols/cryptography/'

export class JwtAdapter implements Encrypter, Decrypter {
  constructor (private readonly secretKey: string) {}

  async encrypt (value: string): Promise<string> {
    return jwt.sign({ id: value }, this.secretKey)
  }

  async decrypt (token: string): Promise<string | null> {
    const value: any = jwt.verify(token, this.secretKey)
    return value
  }
}
