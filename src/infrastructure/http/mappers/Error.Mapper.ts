export class ErrorMapper {
  private static readonly map: Record<string, number> = {
    USER_NOT_FOUND: 404,
    INVALID_PASSWORD: 401,
    UNAUTHORIZED: 401,
    REFRESH_TOKEN_NOT_FOUND: 401,
    SESSION_NOT_FOUND: 401,
    SESSION_REVOKED: 401,
    SESSION_EXPIRED: 401,
    BAD_REQUEST: 400,
    DEFAULT: 500
  }

  public static toHttpStatus(code: string): number {
    return this.map[code] ?? 500
  }
}
