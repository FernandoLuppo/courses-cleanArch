/* eslint-disable @typescript-eslint/no-explicit-any */
export interface HttpAdapterContract<
  TBody = unknown,
  TParams = unknown,
  TQuery = unknown
> {
  body(): TBody
  setBody(data: TBody): void

  params(): TParams
  query(): TQuery
  headers(): Record<string, string | string[] | undefined>

  user(): AuthUser | null
  setUser(user: AuthUser): void

  send(status: number, data: unknown): void

  next(): void

  cookies(): Record<string, string>
  setCookie(name: string, value: string, options?: CookieOptions): void
  clearCookie(name: string): void

  userAgent(): string | null
  ip(): string | null
}

export type AuthUser = {
  sub: string
  email: string
  role?: "ADMIN" | "USER"
}

export type CookieOptions = {
  httpOnly?: boolean
  secure?: boolean
  sameSite?: "strict" | "lax" | "none"
  maxAge?: number
}
