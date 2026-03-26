import { Router } from "express"
import { rotateSessionFactory } from "../../../factory/controller/session/Auth.Factory"
import { routeAdapter } from "../adapters/Route.Adapter"
import { loginFactory } from "../../../factory/controller/session/Login.Factory"
import { logoutFactory } from "../../../factory/controller/session/Logout.Factory"
import { adaptMiddleware } from "../adapters/Middleware.Adapter"
import { authMiddlewareFactory } from "../../../factory/middleware/session/Auth.Factory"
import { loginValidation } from "../../../factory/middleware/session/Login.Factory"

const sessionRoutes = Router()

sessionRoutes.post("/refresh", routeAdapter(rotateSessionFactory()))
sessionRoutes.post(
  "/login",
  adaptMiddleware(loginValidation()),
  routeAdapter(loginFactory())
)
sessionRoutes.post(
  "/logout",
  adaptMiddleware(authMiddlewareFactory()),
  routeAdapter(logoutFactory())
)

export { sessionRoutes }
