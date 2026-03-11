import { AppError } from "./App.Error"

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super({
      message,
      statusCode: 401,
      code: "UNAUTHORIZED"
    })
  }
}
