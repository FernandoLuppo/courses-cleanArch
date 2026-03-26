import z from "zod"
import type { UpdateUserUseCase } from "../../../../application/use-cases/user/UpdateUser.UseCase"
import { UserErrors } from "../../../../domain/entities/user/errors/User.Errors"
import { HttpAdapterContract } from "../../contracts/HttpAdapter.Contract"
import { updatedUserSchema } from "../../schemas/user/UpdateUser.Schema"
import { BaseController } from "../Base.Controller"
import { Result } from "../../../../shared/core/Result"

export class UpdateUserController extends BaseController {
  public constructor(private readonly updateUserUseCase: UpdateUserUseCase) {
    super()
  }

  public async handle(httpAdapter: HttpAdapterContract<UpdateUserDTO>) {
    const userId = httpAdapter.user()?.sub
    if (!userId) {
      return this.handleResult(
        Result.fail(UserErrors.UNAUTHORIZED),
        httpAdapter
      )
    }

    const { name, email, password } = httpAdapter.body()

    const result = await this.updateUserUseCase.execute({
      id: userId,
      name,
      email,
      password
    })

    return this.handleResult(result, httpAdapter)
  }
}

type UpdateUserDTO = z.infer<typeof updatedUserSchema>
