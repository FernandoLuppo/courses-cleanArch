import { ValidateMiddleware } from "../../../infrastructure/http/middleware/Validate.Middleware"
import { loginSchema } from "../../../infrastructure/http/schemas/session/Login.Schema"

export function loginValidation() {
  return new ValidateMiddleware(loginSchema)
}
