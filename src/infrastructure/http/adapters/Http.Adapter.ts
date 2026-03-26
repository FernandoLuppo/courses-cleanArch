import type { Request, Response, NextFunction } from "express"
import type {
  AuthUser,
  CookieOptions,
  HttpAdapterContract
} from "../contracts/HttpAdapter.Contract"

export class HttpAdapter<
  TBody = unknown,
  TParams = unknown,
  TQuery = unknown
> implements HttpAdapterContract<TBody, TParams, TQuery> {
  public constructor(
    private readonly request: Request,
    private readonly response: Response,
    private readonly nextFunction: NextFunction
  ) {}

  public body(): TBody {
    return this.request.body
  }

  public setBody(data: unknown): void {
    this.request.body = data
  }

  public headers(): Record<string, string | string[] | undefined> {
    return this.request.headers
  }

  public params(): TParams {
    return this.request.params as TParams
  }

  public query(): TQuery {
    return this.request.query as TQuery
  }

  public send(status: number, data: unknown): void {
    this.response.status(status).json(data)
  }

  public next(): void {
    this.nextFunction()
  }

  public user(): AuthUser | null {
    if (!this.request.user) return null
    try {
      return JSON.parse(this.request.user)
    } catch {
      return null
    }
  }

  public setUser(user: AuthUser): void {
    this.request.user = JSON.stringify(user)
  }

  public cookies(): Record<string, string> {
    return this.request.cookies
  }

  public setCookie(name: string, value: string, options?: CookieOptions): void {
    if (options) {
      this.response.cookie(name, value, options)
      return
    }

    this.response.cookie(name, value)
  }

  public clearCookie(name: string): void {
    this.response.clearCookie(name)
  }

  public userAgent(): string | null {
    const ua = this.request.headers["user-agent"]
    if (!ua) return null

    return Array.isArray(ua) ? ua[0] : ua
  }

  public ip(): string | null {
    const forwarded = this.request.headers["x-forwarded-for"]

    if (forwarded) {
      const value = Array.isArray(forwarded) ? forwarded[0] : forwarded
      return value.split(",")[0].trim()
    }

    return this.request.ip || null
  }
}
