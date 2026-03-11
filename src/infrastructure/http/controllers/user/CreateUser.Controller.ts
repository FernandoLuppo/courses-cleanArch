import type { CreateUserUseCase } from "../../../../application/use-cases/user/CreateUser.UseCase"
import { UserErrors } from "../../../../domain/entities/user/errors/User.Errors"
import { HttpAdapterProvider } from "../../../providers/HttpAdapter.Provider"

export class CreateUserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly httpAdapterProvider: HttpAdapterProvider
  ) {}

  public async handle() {
    const { name, email, password } = this.httpAdapterProvider.body()

    const user = await this.createUserUseCase.execute({ name, email, password })

    if (!user.success) {
      switch (user.error) {
        case UserErrors.EMAIL_ALREADY_EXISTS:
          return this.httpAdapterProvider.send(400, {
            error: UserErrors.EMAIL_ALREADY_EXISTS,
            message: "Email already exists.",
            success: false
          })

        default:
          return this.httpAdapterProvider.send(500, {
            error: UserErrors.DEFAULT,
            message: "Internal server error.",
            success: false
          })
      }
    }

    return this.httpAdapterProvider.send(201, {
      success: true,
      message: "User created successfully."
    })
  }
}
