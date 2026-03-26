import { LogoutUseCase } from "../../../../application/use-cases/session/Logout.UseCase"
import { HttpAdapterContract } from "../../contracts/HttpAdapter.Contract"
import { BaseController } from "../Base.Controller"

export class LogoutController extends BaseController {
  constructor(private readonly logoutUseCase: LogoutUseCase) {
    super()
  }

  public async handle(httpAdapter: HttpAdapterContract): Promise<void> {
    const cookies = httpAdapter.cookies()
    const refreshToken = cookies.refreshToken

    const okVoid = await this.logoutUseCase.execute({
      refreshToken
    })

    httpAdapter.clearCookie("accessToken")
    httpAdapter.clearCookie("refreshToken")

    return this.handleResult(okVoid, httpAdapter)
  }
}
