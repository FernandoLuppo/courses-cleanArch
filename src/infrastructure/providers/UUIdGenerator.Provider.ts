import type { IUUIdGeneratorProvider } from "../../application/Provider/UUIdGenerator.Provider"
import { v7 } from "uuid"

export class UUIdGeneratorProvider implements IUUIdGeneratorProvider {
  generate(): string {
    return v7()
  }
}
