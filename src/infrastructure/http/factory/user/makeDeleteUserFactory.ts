import { DeleteUserUseCase } from "../../../../application/use-cases/user/DeleteUserUseCase"
import { DeleteUserController } from "../../controllers/user/deleteUserController"
import { UserRepository } from "../../../database/repositories/UserRepository"

export function makeDeleteUserFactory(): DeleteUserController {
  const userRepository = new UserRepository()

  const useCase = new DeleteUserUseCase(userRepository)

  return new DeleteUserController(useCase)
}
