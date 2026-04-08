import { UserErrors } from "../../../domain/entities/user/errors/User.Errors"
import type { UserRepository } from "../../../infrastructure/database/repositories/User.Repository"
import type { IPasswordHasherProvider } from "../../providers/PasswordHasher.Provider"
import { Result } from "../../../shared/core/Result"

export class UpdateUserUseCase {
  public constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasherProvider: IPasswordHasherProvider
  ) {}

  public async execute(input: InputProps): Promise<OutputProps> {
    if (!input.id) {
      return Result.fail(UserErrors.BAD_REQUEST)
    }

    const user = await this.userRepository.findById(input.id)
    if (!user) return Result.fail(UserErrors.USER_NOT_FOUND)

    const isValidPassword = await this.passwordHasherProvider.compare(
      input.password,
      user.password
    )
    if (!isValidPassword) return Result.fail(UserErrors.INVALID_PASSWORD)

    user.update(input.name)
    const updatedUser = await this.userRepository.update(user)
    if (!updatedUser) return Result.fail(UserErrors.USER_NOT_FOUND)

    return Result.ok({
      name: updatedUser.name,
      email: updatedUser.email
    })
  }
}

type InputProps = {
  id: string
  name: string
  email: string
  password: string
}

type OutputProps = Result<{
  name: string
  email: string
}>
