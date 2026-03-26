import z from "zod"
import { LoginUseCase } from "../../../../application/use-cases/session/Login.UseCase"
import {
  ACCESS_TOKEN_EXPIRE_IN,
  REFRESH_TOKEN_EXPIRE_IN
} from "../../../../domain/entities/session/constants/Session.Constants"
import { HttpAdapterContract } from "../../contracts/HttpAdapter.Contract"
import { loginSchema } from "../../schemas/session/Login.Schema"
import { BaseController } from "../Base.Controller"
import { Result } from "../../../../shared/core/Result"

export class LoginController extends BaseController {
  constructor(private readonly loginUseCase: LoginUseCase) {
    super()
  }

  public async handle(httpAdapter: HttpAdapterContract<LoginDTO>) {
    const { email, password } = httpAdapter.body()
    const userAgent = httpAdapter.userAgent()
    const ip = httpAdapter.ip()

    if (!userAgent || !ip) {
      return this.handleResult(
        Result.fail({
          code: "BAD_REQUEST",
          message: "Bad request"
        }),
        httpAdapter
      )
    }

    const result = await this.loginUseCase.execute({
      email,
      password,
      userAgent,
      ip
    })

    if (!result.success) return this.handleResult(result, httpAdapter)

    httpAdapter.setCookie("accessToken", result.data.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: ACCESS_TOKEN_EXPIRE_IN
    })

    httpAdapter.setCookie("refreshToken", result.data.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: REFRESH_TOKEN_EXPIRE_IN
    })

    return this.handleResult(Result.okVoid(), httpAdapter)
  }
}

type LoginDTO = z.infer<typeof loginSchema>
