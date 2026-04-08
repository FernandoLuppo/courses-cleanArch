import { RateLimiterRedis } from "rate-limiter-flexible"
import { RedisClientType } from "../../../infrastructure/redis/RedisClient"
import { RateLimitMiddleware } from "../../../infrastructure/http/middleware/RateLimiter.Middleware"

export const rateLimiterFactory = {
  global(client: RedisClientType) {
    const limiter = new RateLimiterRedis({
      storeClient: client,
      keyPrefix: "rl:global",
      points: 100,
      duration: 60 // 1 min
    })

    return new RateLimitMiddleware(limiter)
  },

  authRoutes(client: RedisClientType) {
    const limiter = new RateLimiterRedis({
      storeClient: client,
      keyPrefix: "rl:auth-routes",
      points: 5,
      duration: 60, // 1 min
      blockDuration: 60 * 15 // 15 min blocked
    })

    return new RateLimitMiddleware(limiter)
  }
}
