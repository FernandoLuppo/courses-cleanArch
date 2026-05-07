// docker compose -f docker-compose.test.yml exec api_test npx ts-node ./scripts/k6/generate-tokens.ts

import jwt from "jsonwebtoken"
import fs from "node:fs"
import path from "node:path"

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET
if (!JWT_ACCESS_SECRET) {
  throw new Error("JWT_ACCESS_SECRET is not defined")
}

type User = {
  id: string
  email: string
  password: string
}

const dataDir = path.resolve(process.cwd(), "tests/k6/src/data")

const users: User[] = JSON.parse(
  fs.readFileSync(path.join(dataDir, "users.json"), "utf-8")
)

const tokens = users.map(user => ({
  id: user.id,
  accessToken: jwt.sign(
    { sub: user.id, email: user.email },
    JWT_ACCESS_SECRET,
    { expiresIn: "1h" }
  ),
  email: user.email,
  password: user.password
}))

fs.writeFileSync(
  path.join(dataDir, "authenticated-users.json"),
  JSON.stringify(tokens, null, 2)
)

console.log("Tokens generated")
