// docker exec -it dot_api_test npx prisma db seed

import "dotenv/config"
import { prisma } from "./prisma-client"
import { PasswordHasherProvider } from "../infrastructure/providers/PasswordHasher.Provider"
import { IdGeneratorProvider } from "../infrastructure/providers/IdGenerator.Provider"

const passwordHasher = new PasswordHasherProvider()
const idGenerator = new IdGeneratorProvider()

async function main() {
  const users = await Promise.all(
    Array.from({ length: 100 }).map(async (_, i) => {
      const password = await passwordHasher.generateHash("12345678Ab@")
      const id = idGenerator.generate()

      return {
        id,
        name: `User ${i}`,
        email: `user${i}@test.com`,
        password
      }
    })
  )

  await prisma.user.createMany({
    data: users,
    skipDuplicates: true
  })

  console.log("Seed completed: 100 users")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
