import { ITokenProvider } from "../../../application/providers/Token.Provider"
import { HttpAdapterContract } from "../contracts/HttpAdapter.Contract"
import { HttpErrors } from "../errors/HttpErrors"

export class AuthMiddleware {
  constructor(private readonly tokenProvider: ITokenProvider) {}

  public async handle(httpAdapter: HttpAdapterContract) {
    const accessToken = this._extractorToken(httpAdapter)

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

  private _extractorToken(httpAdapter: HttpAdapterContract): string | null {
    let accessToken = httpAdapter.cookies().accessToken
    if (accessToken) return accessToken

    const rawAuth = httpAdapter.headers().Authorization
    const authHeader = Array.isArray(rawAuth) ? rawAuth[0] : rawAuth

    if (typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
      accessToken = authHeader.split(" ")[1]
      return accessToken
    }

    return null
  }
}
