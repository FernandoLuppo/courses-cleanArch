import { RateLimiterRedis } from "rate-limiter-flexible"
import { IBruteForceProvider } from "../../application/providers/BruteForce.Provider"
import { RedisConnection } from "../redis/RedisClient"
import { ILoggerProvider } from "../../application/providers/Logger.Provider"
import { randomUUID } from "node:crypto"

export class BruteForceProvider implements IBruteForceProvider {
  private readonly emailLimiter: RateLimiterRedis
  private readonly ipEmailLimiter: RateLimiterRedis
  private readonly duration = 60 * 15 // 15 min
  private readonly blockDuration = 60 * 15 // 15 min
  private readonly emailPoints = 10 // 10 attempts
  private readonly ipEmailPoints = 5 // 5 attempts

  public constructor(private readonly loggerProvider: ILoggerProvider) {
    this.emailLimiter = new RateLimiterRedis({
      storeClient: RedisConnection.getClient(),
      keyPrefix: "brutal-force:email",
      points: this.emailPoints,
      duration: this.duration,
      blockDuration: this.blockDuration
    })

    this.ipEmailLimiter = new RateLimiterRedis({
      storeClient: RedisConnection.getClient(),
      keyPrefix: "brutal-force:ip-email",
      points: this.ipEmailPoints,
      duration: this.duration,
      blockDuration: this.blockDuration
    })
  }

  public async isBlocked(params: {
    email: string
    ip: string
  }): Promise<boolean> {
    try {
      await Promise.all([
        this.emailLimiter.consume(params.email, 0),
        this.ipEmailLimiter.consume(`${params.ip}:${params.email}`, 0)
      ])

      return false
    } catch (error) {
      if (this._isRateLimitError(error)) {
        return true
      }

      this.loggerProvider.error(`RateLimiter error (isBlocked): ${error}`)
      return false
    }
  }
  private _isRateLimitError(error: unknown): error is { msBeforeNext: number } {
    return (
      typeof error === "object" && error !== null && "msBeforeNext" in error
    )
  }

  public async registerFailure(params: {
    email: string
    ip: string
  }): Promise<void> {
    try {
      await Promise.all([
        this.emailLimiter.consume(params.email),
        this.ipEmailLimiter.consume(`${params.ip}:${params.email}`)
      ])
    } catch (error) {
      this.loggerProvider.error(`RateLimiter error (registerFailure): ${error}`)
    }
  }

  public async reset(params: { email: string; ip: string }): Promise<void> {
    try {
      await Promise.all([
        this.emailLimiter.delete(params.email),
        this.ipEmailLimiter.delete(`${params.ip}:${params.email}`)
      ])
    } catch (error) {
      this.loggerProvider.error(`RateLimiter error (reset): ${error}`)
    }
  }

  public async withLock<T>(key: string, fn: () => Promise<T>): Promise<T> {
    const client = RedisConnection.getClient()
    const lockKey = `lock:user:${key}`

    const MAX_RETRIES = 5
    const BASE_DELAY = 50

    const token = randomUUID()

    for (let i = 0; i < MAX_RETRIES; i++) {
      const acquired = await client.set(lockKey, token, {
        NX: true,
        EX: 10
      })

      if (acquired) {
        try {
          return await fn()
        } finally {
          const current = await client.get(lockKey)

          // só remove se ainda for dono do lock
          if (current === token) {
            await client.del(lockKey)
          }
        }
      }

      // backoff com jitter
      const delay = BASE_DELAY + Math.floor(Math.random() * 50)
      await new Promise(res => setTimeout(res, delay))
    }

    throw new Error("Could not acquire lock")
  }
}
