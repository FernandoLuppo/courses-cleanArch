import type { IPasswordHasherProvider } from "../../application/providers/PasswordHasher.Provider"
import argon2 from "argon2"

export class PasswordHasherProvider implements IPasswordHasherProvider {
  private readonly pepper = process.env.PASSWORD_PEPPER

  public async compare(password: string, hashed: string): Promise<boolean> {
    return argon2.verify(hashed, password + this.pepper)
  }

  public async generateHash(password: string): Promise<string> {
    const argon = argon2.hash(password + this.pepper, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16, // 64MB
      timeCost: 3,
      parallelism: 2
    })
    return argon
  }
}
