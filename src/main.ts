import "dotenv/config"
import { Server } from "./infrastructure/http/Server"

console.log(process.env.DATABASE_URL)

const port = Number(process.env.PORT) || 3000

new Server(port).start()
