import type { GetUSerUseCase } from "../../../../application/use-cases/user/GetUser.UseCase"
import {
  AuthUser,
  HttpAdapterContract
} from "../../contracts/HttpAdapter.Contract"
import { BaseController } from "../Base.Controller"

export class GetUserController extends BaseController {
  constructor(private readonly getUserUseCase: GetUSerUseCase) {
    super()
  }

  public async handle(httpAdapter: HttpAdapterContract) {
    const { sub } = httpAdapter.user() as AuthUser

    const result = await this.getUserUseCase.execute({ id: sub })

    return this.handleResult(result, httpAdapter)
  }
}
