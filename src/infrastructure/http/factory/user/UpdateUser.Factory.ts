import { UpdateUserController } from "../../controllers/user/UpdateUser.Controller"
import { UpdateUserUseCase } from "../../../../application/use-cases/user/UpdateUser.UseCase"
import { UserRepository } from "../../../database/repositories/User.Repository"
import { BcryptHashProvider } from "../../../providers/BcryptHash.Provider"
import { prisma } from "../../../../prisma/prisma-client"

export function updateUserFactory(): UpdateUserController {
  const userRepository = new UserRepository(prisma)
  const hashProvider = new BcryptHashProvider()
  const updateUserUseCase = new UpdateUserUseCase(userRepository, hashProvider)
  return new UpdateUserController(updateUserUseCase)
}
