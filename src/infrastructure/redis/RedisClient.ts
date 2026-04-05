import { createClient } from "redis"
import { ILoggerProvider } from "../../application/providers/Logger.Provider"

type RedisClient = ReturnType<typeof createClient>

export class RedisConnection {
  private static client: RedisClient
  private static logger?: ILoggerProvider

  public static setLogger(logger: ILoggerProvider) {
    this.logger = logger
  }

  public static async connect(): Promise<void> {
    const client = createClient({
      url: process.env.REDIS_URL
    })

    client.on("error", error => {
      this.logger?.error(`Redis error: ${error}`)
    })

    await client.connect()

    this.client = client
  }

  public static getClient(): RedisClient {
    if (!this.client) {
      throw new Error("Redis not connected")
    }

    return this.client
  }
}
