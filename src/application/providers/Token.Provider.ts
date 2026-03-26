export interface ITokenProvider {
  generateAccessToken(payload: AccessTokenPayload): string
  generateRefreshToken(): string

  verifyAccessToken(token: string): AccessTokenPayload
}

export type AccessTokenPayload = {
  sub: string
  email: string
  role?: "ADMIN" | "USER"
  sessionId: string
}
