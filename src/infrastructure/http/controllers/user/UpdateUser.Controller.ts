import type { UpdateUserUseCase } from "../../../../application/use-cases/user/UpdateUser.UseCase"
import { UserErrors } from "../../../../domain/entities/user/errors/User.Errors"
import { HttpAdapterProvider } from "../../../providers/HttpAdapter.Provider"

export class UpdateUserController {
  constructor(
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly httpAdapterProvider: HttpAdapterProvider
  ) {}

  public async handle() {
    const id = this.httpAdapterProvider.requestId()
    const { name, email, password } = this.httpAdapterProvider.body()

    const updatedUser = await this.updateUserUseCase.execute({
      id,
      name,
      email,
      password
    })

    if (!updatedUser.success) {
      switch (updatedUser.error) {
        case UserErrors.USER_NOT_FOUND:
          return this.httpAdapterProvider.send(404, {
            error: UserErrors.USER_NOT_FOUND,
            message: "User not found.",
            success: false
          })

        case UserErrors.INVALID_PASSWORD:
          return this.httpAdapterProvider.send(401, {
            error: UserErrors.INVALID_PASSWORD,
            message: "Invalid password.",
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

    return this.httpAdapterProvider.send(200, {
      success: true,
      data: updatedUser.data
    })
  }
}
