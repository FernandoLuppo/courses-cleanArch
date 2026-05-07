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
      memoryCost: 2 ** 14, // 16MB
      timeCost: 2,
      parallelism: 1
    })
    return argon
  }
}

// sob alta carga, o custo do Argon2 impacta latência;
// em produção, poderia ser mitigado com controle de concorrência ou scaling horizontal
