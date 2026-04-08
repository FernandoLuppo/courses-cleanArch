import "dotenv/config"
import { Server } from "./infrastructure/http/Server"
import { LoggerProvider } from "./infrastructure/providers/Logger.Provider"

const port = Number(process.env.PORT) || 3000
const loggerProvider = new LoggerProvider()

new Server(port, loggerProvider).start()
