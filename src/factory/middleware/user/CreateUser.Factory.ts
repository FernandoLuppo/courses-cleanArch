import { ValidateMiddleware } from "../../../infrastructure/http/middleware/Validate.Middleware"
import { createUserSchema } from "../../../infrastructure/http/schemas/user/CreateUser.Schema"

export function createUserValidation() {
  return new ValidateMiddleware(createUserSchema)
}
