import { ILoggerProvider } from "../../application/providers/Logger.Provider"
import Redis from "ioredis"

export type RedisClientType = Redis

export class RedisConnection {
  private static redisClient: RedisClientType
  private static logger?: ILoggerProvider

  public static setLogger(logger: ILoggerProvider) {
    this.logger = logger
  }

  public static async connect(): Promise<void> {
    const client = new Redis(process.env.REDIS_URL as string)

    client.on("error", error => {
      this.logger?.error(`Redis error: ${error}`)
    })

    this.redisClient = client
  }

  public static getClient(): RedisClientType {
    if (!this.redisClient) {
      throw new Error("Redis not connected")
    }

    return this.redisClient
  }
}
