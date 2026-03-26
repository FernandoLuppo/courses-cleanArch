import { RotateSessionUseCase } from "../../../../application/use-cases/session/RotateSession.UseCase"
import {
  ACCESS_TOKEN_EXPIRE_IN,
  REFRESH_TOKEN_EXPIRE_IN
} from "../../../../domain/entities/session/constants/Session.Constants"
import { Result } from "../../../../shared/core/Result"
import { HttpAdapterContract } from "../../contracts/HttpAdapter.Contract"
import { BaseController } from "../Base.Controller"

export class RotateSessionController extends BaseController {
  constructor(private readonly rotateSessionUseCase: RotateSessionUseCase) {
    super()
  }

  public async handle(httpAdapter: HttpAdapterContract) {
    const cookies = httpAdapter.cookies()
    const refreshToken = cookies.refreshToken

    const result = await this.rotateSessionUseCase.execute({ refreshToken })

    if (!result.success) return this.handleResult(result, httpAdapter)

    httpAdapter.setCookie("accessToken", result.data.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: ACCESS_TOKEN_EXPIRE_IN
    })
    httpAdapter.setCookie("refreshToken", result.data.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: REFRESH_TOKEN_EXPIRE_IN
    })

    return this.handleResult(Result.okVoid(), httpAdapter)
  }
}
