import z from "zod"
import type { UpdateUserUseCase } from "../../../../application/use-cases/user/UpdateUser.UseCase"
import {
  AuthUser,
  HttpAdapterContract
} from "../../contracts/HttpAdapter.Contract"
import { updatedUserSchema } from "../../schemas/user/UpdateUser.Schema"
import { BaseController } from "../Base.Controller"

export class UpdateUserController extends BaseController {
  public constructor(private readonly updateUserUseCase: UpdateUserUseCase) {
    super()
  }

  public async handle(httpAdapter: HttpAdapterContract<UpdateUserDTO>) {
    const { sub } = httpAdapter.user() as AuthUser

    const { name, email, password } = httpAdapter.body()

    const result = await this.updateUserUseCase.execute({
      id: sub,
      name,
      email,
      password
    })

    return this.handleResult(result, httpAdapter)
  }
}

type UpdateUserDTO = z.infer<typeof updatedUserSchema>
