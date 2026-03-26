import pino from "pino"
import { ILoggerProvider } from "../../application/providers/Logger.Provider"

export class PinoLogger implements ILoggerProvider {
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
