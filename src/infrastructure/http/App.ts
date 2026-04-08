import express, { Application, Request, Response } from "express"
import cors from "cors"
import { createUserRoutes } from "./routes/user.routes"
import { ErrorMiddleware } from "./middleware/Error.Middleware"
import { RequestIdMiddleware } from "./middleware/RequestId.Middleware"
import { LoggerProvider } from "../providers/Logger.Provider"
import cookieParser from "cookie-parser"
import { createSessionRoutes } from "./routes/session.routes"
import { rateLimiterFactory } from "../../factory/middleware/rate-limiter/RateLimiter.Factory"
import { routeAdapter } from "./adapters/Route.Adapter"
import { RedisClientType } from "../redis/RedisClient"

export class App {
  public readonly app: Application

  constructor(private readonly redisClient: RedisClientType) {
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
    this.app.router.get("/test", (req: Request, res: Response) => {
      return res.status(200).send({ success: true })
    })

    this.app.use("/users", createUserRoutes(this.redisClient))
    this.app.use("/sessions", createSessionRoutes(this.redisClient))
  }

  private cookieParse(): void {
    this.app.use(cookieParser())
  }

  private rateLimit(): void {
    const limiter = rateLimiterFactory.global(this.redisClient)

    this.app.use(routeAdapter(limiter))
  }

  private errorHandling(): void {
    const loggerProvider = new LoggerProvider()
    const errorMiddleware = new ErrorMiddleware(loggerProvider)

    this.app.use(errorMiddleware.handle.bind(errorMiddleware))
  }
}
