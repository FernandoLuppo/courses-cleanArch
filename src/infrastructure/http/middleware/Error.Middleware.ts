/* eslint-disable @typescript-eslint/no-unused-vars */
import type { NextFunction, Request, Response } from "express"
import type { ILoggerProvider } from "../../../application/providers/Logger.Provider"
import { AppError } from "../../../shared/errors/App.Error"

export class ErrorMiddleware {
  constructor(private readonly logger: ILoggerProvider) {}

  public handle(error: Error, req: Request, res: Response, next: NextFunction) {
    const user = req.user ?? null
    const requestId = req.requestId ?? null

    if (error instanceof AppError) {
      const logPayload = {
        event: "http_error",
        user_id: user?.sub || null,
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
      user_id: user?.sub || null,
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
