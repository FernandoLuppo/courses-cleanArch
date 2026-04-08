import { Router } from "express"
import { createUserFactory } from "../../../factory/controller/user/CreateUser.Factory"
import { updateUserFactory } from "../../../factory/controller/user/UpdateUser.Factory"
import { GetUserFactory } from "../../../factory/controller/user/GetUser.Factory"
import { deleteUserFactory } from "../../../factory/controller/user/DeleteUser.Factory"
import { routeAdapter } from "../adapters/Route.Adapter"
import { createUserValidation } from "../../../factory/middleware/user/CreateUser.Factory"
import { adaptMiddleware } from "../adapters/Middleware.Adapter"
import { updateUserValidation } from "../../../factory/middleware/user/UpdateUser.Factory"
import { authMiddlewareFactory } from "../../../factory/middleware/session/Auth.Factory"
import { rateLimiterFactory } from "../../../factory/middleware/rate-limiter/RateLimiter.Factory"
import { RedisClientType } from "../../redis/RedisClient"

export function createUserRoutes(redisClient: RedisClientType) {
  const router = Router()

  router.post(
    "/create",
    adaptMiddleware(rateLimiterFactory.authRoutes(redisClient)),
    adaptMiddleware(createUserValidation()),
    routeAdapter(createUserFactory())
  )

  router.delete(
    "/delete/:id",
    adaptMiddleware(authMiddlewareFactory()),
    routeAdapter(deleteUserFactory())
  )

  router.patch(
    "/update/:id",
    adaptMiddleware(authMiddlewareFactory()),
    adaptMiddleware(updateUserValidation()),
    routeAdapter(updateUserFactory())
  )

  router.get(
    "/get/:id",
    adaptMiddleware(authMiddlewareFactory()),
    routeAdapter(GetUserFactory())
  )

  return router
}
