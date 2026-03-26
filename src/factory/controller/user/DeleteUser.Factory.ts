import { DeleteUserUseCase } from "../../../application/use-cases/user/DeleteUser.UseCase"
import { DeleteUserController } from "../../../infrastructure/http/controllers/user/DeleteUser.Controller"
import { prisma } from "../../../prisma/prisma-client"
import { UserRepository } from "../../../infrastructure/database/repositories/User.Repository"

export function deleteUserFactory(): DeleteUserController {
  const userRepository = new UserRepository(prisma)

  const useCase = new DeleteUserUseCase(userRepository)

  return new DeleteUserController(useCase)
}
