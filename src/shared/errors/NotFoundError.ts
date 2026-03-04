import { AppError } from "./AppError"

export class NotFounded extends AppError {
  constructor(resource: string) {
    super({
      code: "NOT_FOUNDED",
      message: `${resource} not founded`,
      statusCode: 404
    })
  }
}
