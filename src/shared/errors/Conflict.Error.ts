import { AppError } from "./App.Error"

export class ConflictError extends AppError {
  constructor(message: string) {
    super({
      message,
      statusCode: 409,
      code: "CONFLICT"
    })
  }
}
