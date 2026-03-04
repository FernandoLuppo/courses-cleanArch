import { CreateUserUseCase } from "../../../../application/use-cases/user/CreateUserUseCase"
import { BcryptHashProvider } from "../../../providers/BcryptHashProvider"
import { UUIdGeneratorProvider } from "../../../providers/UUIdGeneratorProvider"
import { CreateUserController } from "../../controllers/user/CreateUserController"
import { UserRepository } from "../../../database/repositories/UserRepository"

export function makeCreateUserFactory(): CreateUserController {
  const userRepository = new UserRepository()
  const bcryptHashProvider = new BcryptHashProvider()
  const uuidGeneratorProvider = new UUIdGeneratorProvider()

  const useCase = new CreateUserUseCase(
    userRepository,
    bcryptHashProvider,
    uuidGeneratorProvider
  )

  return new CreateUserController(useCase)
}
