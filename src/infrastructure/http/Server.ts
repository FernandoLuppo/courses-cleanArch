import { ILoggerProvider } from "../../application/providers/Logger.Provider"
import { RedisConnection } from "../redis/RedisClient"
import { App } from "./App"

export class Server {
  private readonly port: number
  private app!: App
  private readonly loggerProvider: ILoggerProvider

  constructor(port: number, loggerProvider: ILoggerProvider) {
    this.port = port
    this.loggerProvider = loggerProvider
  }

  private async initializeInfra(): Promise<void> {
    RedisConnection.setLogger(this.loggerProvider)
    await RedisConnection.connect()
  }

  private initializeApp(): void {
    this.app = new App()
  }

  public async start(): Promise<void> {
    await this.initializeInfra()
    this.initializeApp()

    this.app.app.listen(this.port, () => {
      console.log(`🚀 Server running on port ${this.port}`)
    })
  }
}
