import { Request, Response, NextFunction } from "express"
import { HttpAdapterContract } from "../contracts/HttpAdapter.Contract"
import { HttpAdapter } from "./Http.Adapter"

export const adaptMiddleware = (middleware: {
  handle: (httpAdapter: HttpAdapterContract) => void
}) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const httpAdapter = new HttpAdapter(req, res, next)

    middleware.handle(httpAdapter)
  }
}
