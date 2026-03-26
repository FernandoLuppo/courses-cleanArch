import crypto from "crypto"
import { IHashGeneratorProvider } from "../../application/providers/HashGenerator.Provider"

export class HashGeneratorProvider implements IHashGeneratorProvider {
  public hash(token: string): string {
    return crypto.createHash("sha256").update(token).digest("hex")
  }
}
