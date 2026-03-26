import { ValidateMiddleware } from "../../../middleware/Validate.Middleware"
import { loginSchema } from "../../../schemas/session/Login.Schema"

export function loginValidation() {
  return new ValidateMiddleware(loginSchema)
}
