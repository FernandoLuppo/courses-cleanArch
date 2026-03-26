import { UserErrors } from "../../../domain/entities/user/errors/User.Errors"
import { User } from "../../../domain/entities/user/User.Entity"
import { Result } from "../../../shared/core/Result"
import type { IUserRepository } from "../../../domain/repositories/User.Repository"
import type { IPasswordHasherProvider } from "../../providers/PasswordHasher.Provider"
import type { IIdGeneratorProvider } from "../../providers/IdGenerator.Provider"

export class CreateUserUseCase {
  public constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasherProvider: IPasswordHasherProvider,
    private readonly idGeneratorProvider: IIdGeneratorProvider
  ) {}

  public async execute(input: InputProps): Promise<OutputProps> {
    const user = await this.userRepository.findByEmail(input.email)

    if (user) return Result.fail(UserErrors.EMAIL_ALREADY_EXISTS)

    const id = this.idGeneratorProvider.generate()
    const password = await this.passwordHasherProvider.generateHash(
      input.password
    )

    const data = User.create(id, input.name, input.email, password)

    const newUser = await this.userRepository.create(data)

    if (!newUser) return Result.fail(UserErrors.DEFAULT)

    return Result.okVoid()
  }
}

type InputProps = {
  name: string
  email: string
  password: string
}

type OutputProps = Result<void>
