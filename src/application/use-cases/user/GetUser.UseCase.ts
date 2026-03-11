import type { IUserRepository } from "../../../domain/repositories/User.Repository"
import {
  type UserError,
  UserErrors
} from "../../../domain/entities/user/errors/User.Errors"
import { Result } from "../../../shared/core/Result"

type OutputProps = Result<UserInfos, UserError>

export class GetUSerUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  public async execute(input: InputProps): Promise<OutputProps> {
    const user = await this.userRepository.findById(input.id)
    if (!user) {
      return Result.fail(UserErrors.USER_NOT_FOUND)
    }

    const userInfos = {
      name: user.name,
      email: user.email
    }
    return Result.ok(userInfos)
  }
}

type InputProps = {
  id: string
}
type UserInfos = {
  name: string
  email: string
}
