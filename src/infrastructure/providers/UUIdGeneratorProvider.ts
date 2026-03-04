import { IUUIdGeneratorProvider } from "../../application/contracts/IUUIdGenerator"
import { v7 } from "uuid"

export class UUIdGeneratorProvider implements IUUIdGeneratorProvider {
  generate(): string {
    return v7()
  }
}
