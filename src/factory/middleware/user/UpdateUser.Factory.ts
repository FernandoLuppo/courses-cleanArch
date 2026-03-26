import { ValidateMiddleware } from "../../../infrastructure/http/middleware/Validate.Middleware"
import { updatedUserSchema } from "../../../infrastructure/http/schemas/user/UpdateUser.Schema"

export function updateUserValidation() {
  return new ValidateMiddleware(updatedUserSchema)
}
