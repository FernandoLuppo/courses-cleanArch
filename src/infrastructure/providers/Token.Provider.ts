import {
  AccessTokenPayload,
  ITokenProvider
} from "../../application/providers/Token.Provider"
import jwt from "jsonwebtoken"
import { UnauthorizedError } from "../../shared/errors/Unauthorized.Error"
import { ACCESS_TOKEN_EXPIRE_IN } from "../../domain/entities/session/constants/Session.Constants"
import { randomBytes } from "node:crypto"

export class TokenProvider implements ITokenProvider {
  private readonly accessSecret = process.env.JWT_ACCESS_SECRET as string

  public generateAccessToken(payload: AccessTokenPayload): string {
    const accessToken = jwt.sign(payload, this.accessSecret, {
      expiresIn: `${ACCESS_TOKEN_EXPIRE_IN}m`
    })

    return accessToken
  }

  public generateRefreshToken(): string {
    return randomBytes(64).toString("hex")
  }

  public verifyAccessToken(token: string): AccessTokenPayload {
    const payload = jwt.verify(token, this.accessSecret) as jwt.JwtPayload

    if (typeof payload === "string")
      throw new UnauthorizedError("Invalid token")

    const { sub, email, role, sessionId } = payload as AccessTokenPayload
    return { sub, email, role, sessionId }
  }
}
