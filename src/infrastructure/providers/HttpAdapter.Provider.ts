/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Request, Response } from "express"
import type { IHttpAdapterProvider } from "../../application/Provider/HttpAdapter.Provider"

export class HttpAdapterProvider implements IHttpAdapterProvider {
  constructor(
    private readonly request: Request,
    private readonly response: Response
  ) {}

  public body() {
    return this.request.body
  }

  public headers(): Record<string, string | string[] | undefined> {
    return this.request.headers
  }

  public params(): any {
    return this.request.params
  }

  public query(): any {
    return this.request.query
  }

  public requestId(): string {
    return this.request.requestId
  }

  public send(status: number, data: unknown): void {
    this.response.status(status).json(data)
  }
}
