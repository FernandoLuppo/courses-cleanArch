import { Router } from "express"
import { rotateSessionFactory } from "../../../factory/controller/session/Auth.Factory"
import { routeAdapter } from "../adapters/Route.Adapter"
import { loginFactory } from "../../../factory/controller/session/Login.Factory"
import { logoutFactory } from "../../../factory/controller/session/Logout.Factory"
import { adaptMiddleware } from "../adapters/Middleware.Adapter"
import { authMiddlewareFactory } from "../../../factory/middleware/session/Auth.Factory"
import { loginValidation } from "../../../factory/middleware/session/Login.Factory"
import { rateLimiterFactory } from "../../../factory/middleware/rate-limiter/RateLimiter.Factory"
import { RedisClientType } from "../../redis/RedisClient"

export function createSessionRoutes(redisClient: RedisClientType) {
  const router = Router()

  router.get("/refresh", routeAdapter(rotateSessionFactory()))

  router.post(
    "/login",
    adaptMiddleware(rateLimiterFactory.authRoutes(redisClient)),
    adaptMiddleware(loginValidation()),
    routeAdapter(loginFactory())
  )

  router.get(
    "/logout",
    adaptMiddleware(authMiddlewareFactory()),
    routeAdapter(logoutFactory())
  )

  return router
}
