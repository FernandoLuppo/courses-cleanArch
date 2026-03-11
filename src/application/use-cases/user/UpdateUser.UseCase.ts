import {
  type UserError,
  UserErrors
} from "../../../domain/entities/user/errors/User.Errors"
import type { UserRepository } from "../../../infrastructure/database/repositories/User.Repository"
import type { BcryptHashProvider } from "../../../infrastructure/providers/BcryptHash.Provider"
import { Result } from "../../../shared/core/Result"

export class UpdateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashProvider: BcryptHashProvider
  ) {}

  async execute(input: InputProps): Promise<OutputProps> {
    const user = await this.userRepository.findById(input.id)
    if (!user) {
      return { success: false, error: UserErrors.USER_NOT_FOUND }
    }
    const isValidPassword = this.hashProvider.compare(
      input.password,
      user.password
    )

    if (!isValidPassword) {
      return { success: false, error: UserErrors.INVALID_PASSWORD }
    }

    const newPassword = await this.hashProvider.generateHash(input.password)

    user.update(input.name, input.email, newPassword)

    const updatedUser = await this.userRepository.update(user)

    if (!updatedUser) {
      return { success: false, error: UserErrors.USER_NOT_FOUND }
    }

    return {
      data: {
        name: updatedUser.name,
        email: updatedUser.email
      },
      success: true
    }
  }
}

type InputProps = {
  id: string
  name: string
  email: string
  password: string
}

type OutputProps = Result<
  {
    name: string
    email: string
  },
  UserError
>
