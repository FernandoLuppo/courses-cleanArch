import type { GetUSerUseCase } from "../../../../application/use-cases/user/GetUser.UseCase"
import { UserErrors } from "../../../../domain/entities/user/errors/User.Errors"
import { Result } from "../../../../shared/core/Result"
import { HttpAdapterContract } from "../../contracts/HttpAdapter.Contract"
import { BaseController } from "../Base.Controller"

export class GetUserController extends BaseController {
  constructor(private readonly getUserUseCase: GetUSerUseCase) {
    super()
  }

  public async handle(httpAdapter: HttpAdapterContract) {
    const userId = httpAdapter.user()?.sub

    if (!userId) {
      return this.handleResult(
        Result.fail(UserErrors.UNAUTHORIZED),
        httpAdapter
      )
    }

    const result = await this.getUserUseCase.execute({ id: userId })

    return this.handleResult(result, httpAdapter)
  }
}
