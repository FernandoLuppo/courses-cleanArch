import { UpdateUserController } from "../../../infrastructure/http/controllers/user/UpdateUser.Controller"
import { UpdateUserUseCase } from "../../../application/use-cases/user/UpdateUser.UseCase"
import { UserRepository } from "../../../infrastructure/database/repositories/User.Repository"
import { prisma } from "../../../prisma/prisma-client"
import { PasswordHasherProvider } from "../../../infrastructure/providers/PasswordHasher.Provider"

export function updateUserFactory(): UpdateUserController {
  const userRepository = new UserRepository(prisma)
  const passwordHasherProvider = new PasswordHasherProvider()
  const updateUserUseCase = new UpdateUserUseCase(
    userRepository,
    passwordHasherProvider
  )
  return new UpdateUserController(updateUserUseCase)
}
