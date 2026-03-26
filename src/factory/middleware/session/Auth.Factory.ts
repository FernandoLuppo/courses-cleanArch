import { TokenProvider } from "../../../infrastructure/providers/Token.Provider"
import { AuthMiddleware } from "../../../infrastructure/http/middleware/Auth.Middleware"

export const authMiddlewareFactory = () => {
  const tokenProvider = new TokenProvider()

  return new AuthMiddleware(tokenProvider)
}
