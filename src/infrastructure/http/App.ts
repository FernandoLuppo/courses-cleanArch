import express, { Application } from "express"
import cors from "cors"
import { userRoutes } from "./routes/user.routes"
import { ErrorMiddleware } from "./middleware/Error.Middleware"
import { RequestIdMiddleware } from "./middleware/RequestId.Middleware"
import { LoggerProvider } from "../providers/Logger.Provider"
import cookieParser from "cookie-parser"
import { sessionRoutes } from "./routes/session.routes"
import { rateLimiterFactory } from "../../factory/middleware/rate-limiter/RateLimiter.Factory"
import { routeAdapter } from "./adapters/Route.Adapter"

export class App {
  public readonly app: Application

  constructor() {
    this.app = express()
    this.middlewares()
    this.cookieParse()
    this.rateLimit()
    this.idHandling()
    this.routes()
    this.errorHandling()
  }

  private middlewares(): void {
    this.app.use(cors())
    this.app.use(express.json())
  }

  private idHandling(): void {
    const requestIdMiddleware = new RequestIdMiddleware()

    this.app.use(requestIdMiddleware.handle.bind(requestIdMiddleware))
  }

  private routes(): void {
    this.app.use("/users", userRoutes)
    this.app.use("/sessions", sessionRoutes)
  }

  private cookieParse(): void {
    this.app.use(cookieParser())
  }

  private rateLimit(): void {
    const limiter = rateLimiterFactory.global()

    this.app.use(routeAdapter(limiter))
  }

  private errorHandling(): void {
    const loggerProvider = new LoggerProvider()
    const errorMiddleware = new ErrorMiddleware(loggerProvider)

    this.app.use(errorMiddleware.handle.bind(errorMiddleware))
  }
}
