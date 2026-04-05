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

const userRoutes = Router()

userRoutes.post(
  "/create",
  adaptMiddleware(rateLimiterFactory.authRoutes()),
  adaptMiddleware(createUserValidation()),
  routeAdapter(createUserFactory())
)

userRoutes.delete(
  "/delete/:id",
  adaptMiddleware(authMiddlewareFactory()),
  routeAdapter(deleteUserFactory())
)
userRoutes.patch(
  "/update/:id",
  adaptMiddleware(authMiddlewareFactory()),
  adaptMiddleware(updateUserValidation()),
  routeAdapter(updateUserFactory())
)
userRoutes.get("/get/:id", routeAdapter(GetUserFactory()))

export { userRoutes }
