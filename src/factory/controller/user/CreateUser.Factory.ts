import { CreateUserUseCase } from "../../../application/use-cases/user/CreateUser.UseCase"
import { IdGeneratorProvider } from "../../../infrastructure/providers/IdGenerator.Provider"
import { CreateUserController } from "../../../infrastructure/http/controllers/user/CreateUser.Controller"
import { UserRepository } from "../../../infrastructure/database/repositories/User.Repository"
import { prisma } from "../../../prisma/prisma-client"
import { PasswordHasherProvider } from "../../../infrastructure/providers/PasswordHasher.Provider"

export function createUserFactory(): CreateUserController {
  const userRepository = new UserRepository(prisma)
  const passwordHasherProvider = new PasswordHasherProvider()
  const idGeneratorProvider = new IdGeneratorProvider()

  const useCase = new CreateUserUseCase(
    userRepository,
    passwordHasherProvider,
    idGeneratorProvider
  )

  return new CreateUserController(useCase)
}
