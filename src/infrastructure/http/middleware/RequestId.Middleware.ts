import type { Request, Response, NextFunction } from "express"
import { randomUUID } from "crypto"

export class RequestIdMiddleware {
  handle(req: Request, _res: Response, next: NextFunction): void {
    const requestId = req.headers["x-request-id"]?.toString() ?? randomUUID()

    req.requestId = requestId

    next()
  }
}
