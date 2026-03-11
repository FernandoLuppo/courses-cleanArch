import type { GetUSerUseCase } from "../../../../application/use-cases/user/GetUser.UseCase"
import { UserErrors } from "../../../../domain/entities/user/errors/User.Errors"
import { HttpAdapterProvider } from "../../../providers/HttpAdapter.Provider"

export class GetUserController {
  constructor(
    private readonly getUserUseCase: GetUSerUseCase,
    private readonly httpAdapterProvider: HttpAdapterProvider
  ) {}

  public async handle() {
    const id = this.httpAdapterProvider.requestId()

    const user = await this.getUserUseCase.execute({ id })

    if (!user.success) {
      switch (user.error) {
        case UserErrors.USER_NOT_FOUND:
          return this.httpAdapterProvider.send(404, {
            error: UserErrors.USER_NOT_FOUND,
            message: "User not found"
          })

        default:
          return this.httpAdapterProvider.send(500, {
            error: UserErrors.DEFAULT,
            message: "Internal server error"
          })
      }
    }

    return this.httpAdapterProvider.send(200, {
      success: true,
      message: "User found successfully.",
      data: user.data
    })
  }
}
