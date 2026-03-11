import type { DeleteUserUseCase } from "../../../../application/use-cases/user/DeleteUser.UseCase"
import { UserErrors } from "../../../../domain/entities/user/errors/User.Errors"
import { HttpAdapterProvider } from "../../../providers/HttpAdapter.Provider"

export class DeleteUserController {
  constructor(
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly httpAdapterProvider: HttpAdapterProvider
  ) {}

  public async handle() {
    const { id } = this.httpAdapterProvider.params()

    const data = await this.deleteUserUseCase.execute({ id })

    if (!data.success) {
      switch (data.error) {
        case UserErrors.USER_NOT_FOUND:
          return this.httpAdapterProvider.send(404, {
            error: UserErrors.USER_NOT_FOUND,
            message: "User not found.",
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

    return this.httpAdapterProvider.send(204, {
      success: true,
      message: "User deleted successfully."
    })
  }
}
