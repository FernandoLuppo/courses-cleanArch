import { UserErrors } from "../../../domain/entities/user/errors/User.Errors"
import type { IUserRepository } from "../../../domain/repositories/User.Repository"
import { Result } from "../../../shared/core/Result"

export class DeleteUserUseCase {
  public constructor(private readonly userRepository: IUserRepository) {}

  public async execute(input: InputProps): Promise<OutputProps> {
    const user = await this.userRepository.findById(input.id)
    if (!user) return Result.fail(UserErrors.USER_NOT_FOUND)

    const deletedUser = await this.userRepository.delete(input.id)
    if (!deletedUser) return Result.fail(UserErrors.DEFAULT)

    return Result.okVoid()
  }
}

type InputProps = { id: string }

type OutputProps = Result<void>
