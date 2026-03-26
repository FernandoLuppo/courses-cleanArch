import type { IIdGeneratorProvider } from "../../application/providers/IdGenerator.Provider"
import { v7 } from "uuid"

export class IdGeneratorProvider implements IIdGeneratorProvider {
  generate(): string {
    return v7()
  }
}
