import { DeleteUserUseCase } from "../../../../application/use-cases/user/DeleteUser.UseCase"
import { DeleteUserController } from "../../controllers/user/DeleteUser.Controller"
import { UserRepository } from "../../../database/repositories/User.Repository"
import { prisma } from "../../../../prisma/prisma-client"

export function deleteUserFactory(): DeleteUserController {
  const userRepository = new UserRepository(prisma)

  const useCase = new DeleteUserUseCase(userRepository)

  return new DeleteUserController(useCase)
}
