import { HttpAdapterContract } from "./HttpAdapter.Contract"

export interface MiddlewareContract {
  handle(http: HttpAdapterContract): Promise<void> | void
}
