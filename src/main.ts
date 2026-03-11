import "dotenv/config"
import { Server } from "./infrastructure/http/server"

const port = Number(process.env.PORT) || 3000

new Server(port).start()
