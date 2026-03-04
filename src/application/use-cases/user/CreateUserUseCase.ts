import { User } from "../../../domain/entities/User"
import { IUserRepository } from "../../../domain/repositories/IUserRepository"
import { IHashProvider } from "../../contracts/IHashProvides"
import { IUUIdGeneratorProvider } from "../../contracts/IUUIdGenerator"

interface ICreateUserInput {
  name: string
  email: string
  password: string
}

export class CreateUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hashProvider: IHashProvider,
    private readonly uuidProvider: IUUIdGeneratorProvider
  ) {}

  public async execute(input: ICreateUserInput): Promise<void> {
    const uuid = this.uuidProvider.generate()
    const password = await this.hashProvider.generateHash(input.password)

    const newUser = new User(uuid, input.name, input.email, password)

    const createdUser = await this.userRepository.create(newUser)

    if (!createdUser) {
      throw new Error("")
    }
  }
}
