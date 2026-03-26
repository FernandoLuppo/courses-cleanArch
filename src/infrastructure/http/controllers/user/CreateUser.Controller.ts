import z from "zod"
import type { CreateUserUseCase } from "../../../../application/use-cases/user/CreateUser.UseCase"
import { HttpAdapterContract } from "../../contracts/HttpAdapter.Contract"
import { createUserSchema } from "../../schemas/user/CreateUser.Schema"
import { BaseController } from "../Base.Controller"

export class CreateUserController extends BaseController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {
    super()
  }

  public async handle(httpAdapter: HttpAdapterContract<CreateUserDTO>) {
    const { name, email, password } = httpAdapter.body()

    const result = await this.createUserUseCase.execute({
      name,
      email,
      password
    })

    return this.handleResult(result, httpAdapter, 201)
  }
}

type CreateUserDTO = z.infer<typeof createUserSchema>
