// docker compose -f docker-compose.test.yml exec api_test npx ts-node scripts/k6/get-db-users.ts

import "dotenv/config"
import fs from "fs"
import path from "path"
import { prisma } from "../../src/prisma/prisma-client"

async function main() {
  try {
    const users: User[] = await prisma.$queryRaw<User[]>`
      SELECT id, email, '12345678Ab@' as password
      FROM "User"
      LIMIT 100;
    `

    const dataPath = path.resolve(process.cwd(), "tests/k6/src/data/users.json")
    const dir = path.dirname(dataPath)

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    fs.writeFileSync(dataPath, JSON.stringify(users, null, 2))

    console.log(`K6 Data Setup: ${users.length} users exported to ${dataPath}`)
  } catch (error) {
    console.log(error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}
main()

type User = {
  id: string
  email: string
  password: string
}
