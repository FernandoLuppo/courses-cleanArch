import pino from "pino"
import { Logger } from "./Logger"

export class PinoLogger implements Logger {
  private readonly logger = pino({
    level: process.env.LOG_LEVEL || "info",
    transport:
      process.env.NODE_ENV !== "production"
        ? { target: "pino-pretty", options: { colorize: true } }
        : undefined
  })

  info(data: unknown): void {
    this.logger.info(data)
  }

  warn(data: unknown): void {
    this.logger.warn(data)
  }

  error(data: unknown): void {
    this.logger.error(data)
  }
}
