import { CreateUserUseCase } from "../../../../application/use-cases/user/CreateUser.UseCase"
import { BcryptHashProvider } from "../../../providers/BcryptHash.Provider"
import { UUIdGeneratorProvider } from "../../../providers/UUIdGenerator.Provider"
import { CreateUserController } from "../../controllers/user/CreateUser.Controller"
import { UserRepository } from "../../../database/repositories/User.Repository"
import { prisma } from "../../../../prisma/prisma-client"

export function createUserFactory(): CreateUserController {
  const userRepository = new UserRepository(prisma)
  const bcryptHashProvider = new BcryptHashProvider()
  const uuidGeneratorProvider = new UUIdGeneratorProvider()

  const useCase = new CreateUserUseCase(
    userRepository,
    bcryptHashProvider,
    uuidGeneratorProvider
  )

  return new CreateUserController(useCase)
}
