import express, { Application } from "express"
import cors from "cors"
import { userRoutes } from "./routes/user.routes"
import { ErrorMiddleware } from "./middleware/Error.Middleware"
import { RequestIdMiddleware } from "./middleware/RequestId.Middleware"
import { PinoLogger } from "../providers/Logger.Provider"
import cookieParser from "cookie-parser"
import { sessionRoutes } from "./routes/session.routes"

export class App {
  public readonly app: Application

  constructor() {
    this.app = express()
    this.middlewares()
    this.idHandling()
    this.routes()
    this.cookieParse()
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

  private errorHandling(): void {
    const logger = new PinoLogger()
    const errorMiddleware = new ErrorMiddleware(logger)

    this.app.use(errorMiddleware.handle.bind(errorMiddleware))
  }
}
