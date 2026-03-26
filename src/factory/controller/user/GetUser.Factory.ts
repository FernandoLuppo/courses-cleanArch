import { GetUSerUseCase } from "../../../../../application/use-cases/user/GetUser.UseCase"
import { UserRepository } from "../../../../database/repositories/User.Repository"
import { GetUserController } from "../../../controllers/user/GetUser.Controller"
import { prisma } from "../../../../../prisma/prisma-client"

export function GetUserFactory(): GetUserController {
  const userRepository = new UserRepository(prisma)
  const useCase = new GetUSerUseCase(userRepository)

  return new GetUserController(useCase)
}
