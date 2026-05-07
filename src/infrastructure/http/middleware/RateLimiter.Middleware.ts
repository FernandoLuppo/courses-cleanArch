import { RateLimiterMemory, RateLimiterRedis } from "rate-limiter-flexible"
import { HttpAdapterContract } from "../contracts/HttpAdapter.Contract"
import { HttpErrors } from "../errors/HttpErrors"

export class RateLimitMiddleware {
  constructor(
    private readonly rateLimiter: RateLimiterRedis | RateLimiterMemory
  ) {}

  public async handle(httpAdapter: HttpAdapterContract): Promise<void> {
    try {
      const ip = httpAdapter.ip() || "unknown"

      if (process.env.IS_PERFORMANCE_TEST !== "true") {
        await this.rateLimiter.consume(ip)
      }

      return httpAdapter.next()
    } catch (error: unknown) {
      if (this.isRateLimitError(error)) {
        const retryAfter = Math.ceil(error.msBeforeNext / 1000) || 60

        httpAdapter.setHeader?.("Retry-After", String(retryAfter))

        return httpAdapter.send(429, HttpErrors.TOO_MANY_REQUESTS)
      }

      throw error
    }
  }

  private isRateLimitError(error: unknown): error is { msBeforeNext: number } {
    return (
      typeof error === "object" &&
      error !== null &&
      "msBeforeNext" in error &&
      typeof (error as { msBeforeNext: unknown }).msBeforeNext === "number"
    )
  }
}
