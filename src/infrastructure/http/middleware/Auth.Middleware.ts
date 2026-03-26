import { ITokenProvider } from "../../../application/providers/Token.Provider"
import { HttpAdapterContract } from "../contracts/HttpAdapter.Contract"
import { HttpErrors } from "../errors/HttpErrors"

export class AuthMiddleware {
  constructor(private readonly tokenProvider: ITokenProvider) {}

  public async handle(httpAdapter: HttpAdapterContract) {
    const accessToken = httpAdapter.cookies().accessToken

    if (!accessToken) {
      return httpAdapter.send(401, HttpErrors.UNAUTHORIZED)
    }

    try {
      const payload = this.tokenProvider.verifyAccessToken(accessToken)

      httpAdapter.setUser(payload)

      httpAdapter.next()
    } catch {
      return httpAdapter.send(401, HttpErrors.UNAUTHORIZED)
    }
  }
}
