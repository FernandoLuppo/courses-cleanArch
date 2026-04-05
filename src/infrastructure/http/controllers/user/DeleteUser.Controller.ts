import type { DeleteUserUseCase } from "../../../../application/use-cases/user/DeleteUser.UseCase"
import { UserErrors } from "../../../../domain/entities/user/errors/User.Errors"
import { Result } from "../../../../shared/core/Result"
import {
  AuthUser,
  HttpAdapterContract
} from "../../contracts/HttpAdapter.Contract"
import { BaseController } from "../Base.Controller"

export class DeleteUserController extends BaseController {
  constructor(private readonly deleteUserUseCase: DeleteUserUseCase) {
    super()
  }

  public async handle(
    httpAdapter: HttpAdapterContract<unknown, DeleteUserParams>
  ) {
    const { id } = httpAdapter.params()
    const { sub } = httpAdapter.user() as AuthUser

    const result = await this.deleteUserUseCase.execute({ id, sub })

    return this.handleResult(result, httpAdapter)
  }
}

type DeleteUserParams = {
  id: string
}
