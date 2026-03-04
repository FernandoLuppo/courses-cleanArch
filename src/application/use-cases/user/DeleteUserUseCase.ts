import { IUserRepository } from "../../../domain/repositories/IUserRepository"

interface IDeleteUserInput {
  email: string
}

export class DeleteUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  public async execute(input: IDeleteUserInput): Promise<void> {
    const deletedUser = await this.userRepository.deleteByEmail(input.email)

    if (!deletedUser) {
      throw new Error("")
    }
  }
}
