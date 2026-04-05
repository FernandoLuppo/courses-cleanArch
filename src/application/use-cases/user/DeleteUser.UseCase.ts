import { UserErrors } from "../../../domain/entities/user/errors/User.Errors"
import type { IUserRepository } from "../../../domain/repositories/User.Repository"
import { Result } from "../../../shared/core/Result"

export class DeleteUserUseCase {
  public constructor(private readonly userRepository: IUserRepository) {}

  public async execute(input: InputProps): Promise<OutputProps> {
    if (!input.id) {
      return Result.fail(UserErrors.BAD_REQUEST)
    }

    if (input.id !== input.sub) {
      return Result.fail(UserErrors.UNAUTHORIZED)
    }

    const deletedUser = await this.userRepository.delete(input.id)
    if (!deletedUser) return Result.fail(UserErrors.DEFAULT)

    return Result.okVoid()
  }
}

type InputProps = { id: string; sub: string }

type OutputProps = Result<void>
