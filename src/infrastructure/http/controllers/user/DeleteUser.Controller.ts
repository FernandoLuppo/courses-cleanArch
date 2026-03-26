import type { DeleteUserUseCase } from "../../../../application/use-cases/user/DeleteUser.UseCase"
import { UserErrors } from "../../../../domain/entities/user/errors/User.Errors"
import { Result } from "../../../../shared/core/Result"
import { HttpAdapterContract } from "../../contracts/HttpAdapter.Contract"
import { BaseController } from "../Base.Controller"

export class DeleteUserController extends BaseController {
  constructor(private readonly deleteUserUseCase: DeleteUserUseCase) {
    super()
  }

  public async handle(
    httpAdapter: HttpAdapterContract<unknown, DeleteUserParams>
  ) {
    const { id } = httpAdapter.params()

    if (!id) {
      return this.handleResult(Result.fail(UserErrors.BAD_REQUEST), httpAdapter)
    }

    const result = await this.deleteUserUseCase.execute({ id })

    return this.handleResult(result, httpAdapter)
  }
}

type DeleteUserParams = {
  id: string
}
