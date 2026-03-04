import { NextFunction, Request, Response } from "express"
import { AppError } from "../../../shared/errors/AppError"
import { Logger } from "../../../shared/logger/Logger"

export class ErrorMiddleware {
  constructor(private readonly logger: Logger) {}

  public handle(
    error: Error,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _next: NextFunction
  ) {
    const requestId = req.requestId

    if (error instanceof AppError) {
      const logPayload = {
        event: "http_error",
        request_id: requestId,
        method: req.method,
        path: req.path,
        statusCode: error.statusCode,
        code: error.code,
        message: error.message
      }

      if (error.isOperational) {
        this.logger.warn(logPayload)
      } else {
        this.logger.error(logPayload)
      }

      return res.status(error.statusCode).json({
        error: error.code,
        message: error.message
      })
    }

    this.logger.error({
      event: "unexpected_error",
      request_id: requestId,
      method: req.method,
      path: req.path,
      statusCode: 500,
      message: error.message,
      stack: error.stack
    })

    return res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
      message:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : error.message
    })
  }
}
