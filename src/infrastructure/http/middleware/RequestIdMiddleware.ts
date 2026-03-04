import { randomUUID } from "crypto"
import { Request, Response, NextFunction } from "express"

export class RequestIdMiddleware {
  handle(req: Request, _res: Response, next: NextFunction): void {
    const requestId = req.headers["x-request-id"]?.toString() ?? randomUUID()

    req.requestId = requestId

    next()
  }
}
