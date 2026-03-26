import { Request, Response, NextFunction } from "express"
import { HttpAdapter } from "./Http.Adapter"
import { HttpAdapterContract } from "../contracts/HttpAdapter.Contract"

export function routeAdapter<
  TBody = unknown,
  TParams = unknown,
  TQuery = unknown
>(controller: {
  handle: (
    httpAdapter: HttpAdapterContract<TBody, TParams, TQuery>
  ) => Promise<void> | void
}) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const httpAdapter = new HttpAdapter<TBody, TParams, TQuery>(req, res, next)
    await controller.handle(httpAdapter)
  }
}
