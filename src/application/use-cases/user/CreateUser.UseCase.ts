import {
  UserErrors,
  type UserError
} from "../../../domain/entities/user/errors/User.Errors"
import { User } from "../../../domain/entities/user/User.Entity"
import { Result } from "../../../shared/core/Result"
import type { IUserRepository } from "../../../domain/repositories/User.Repository"
import type { IHashProvider } from "../../Provider/Hash.Provider"
import type { IUUIdGeneratorProvider } from "../../Provider/UUIdGenerator.Provider"

export class CreateUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hashProvider: IHashProvider,
    private readonly uuidProvider: IUUIdGeneratorProvider
  ) {}

  public async execute(input: InputProps): Promise<OutputProps> {
    const user = await this.userRepository.findByEmail(input.email)

    if (user) {
      return Result.fail(UserErrors.EMAIL_ALREADY_EXISTS)
    }

    const id = this.uuidProvider.generate()
    const password = await this.hashProvider.generateHash(input.password)

    const data = User.create(id, input.name, input.email, password)

    const newUser = await this.userRepository.create(data)

    if (!newUser) {
      return Result.fail(UserErrors.DEFAULT)
    }

    return Result.okVoid()
  }
}

type InputProps = {
  name: string
  email: string
  password: string
}

type OutputProps = Result<void, UserError>
