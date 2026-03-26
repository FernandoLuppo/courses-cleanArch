import { App } from "./App"

export class Server {
  private readonly port: number
  private readonly app: App

  constructor(port: number) {
    this.port = port
    this.app = new App()
  }

  public async start(): Promise<void> {
    this.app.app.listen(this.port, () => {
      console.log(`🚀 Server running on port ${this.port}`)
    })
  }
}
