import { AppError } from "./AppError"

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super({
      message,
      statusCode: 400,
      code: "VALIDATION_ERROR",
      details
    })
  }
}
