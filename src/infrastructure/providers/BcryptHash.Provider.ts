import type { IHashProvider } from "../../application/Provider/Hash.Provider"
import bcrypt from "bcryptjs"

export class BcryptHashProvider implements IHashProvider {
  public async compare(password: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(password, hashed)
  }

  public async generateHash(password: string): Promise<string> {
    return bcrypt.hash(password, 10)
  }
}
