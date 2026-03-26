import { ValidateMiddleware } from "../../../middleware/Validate.Middleware"
import { createUserSchema } from "../../../schemas/user/CreateUser.Schema"

export function createUserValidation() {
  return new ValidateMiddleware(createUserSchema)
}
