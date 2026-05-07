// yarn k6 tests/k6/dist/performance/login/distributed-attack.js -e BASE_URL=http://dot_api_test:3000

import http from "k6/http"
import { check } from "k6"
import { Rate } from "k6/metrics"
import { User } from "../../types"

const USERS: User[] = JSON.parse(open("../../../src/data/users.json"))

const blockedRate = new Rate("blocked_rate")

export const options = {
  scenarios: {
    distributed_attack: {
      executor: "constant-arrival-rate",
      rate: 100,
      timeUnit: "1s",
      duration: "1m",
      preAllocatedVUs: 50,
      maxVUs: 200
    }
  },
  thresholds: {
    checks: ["rate>0.95"],
    blocked_rate: ["rate>0.95"]
  }
}

const BASE_API = __ENV.BASE_URL

export default function () {
  if (!USERS.length) {
    throw new Error("No users available")
  }

  const user = USERS[Math.floor(Math.random() * USERS.length)]

  const fakeIp = `10.${__VU}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`

  const res = http.post(
    `${BASE_API}/sessions/login`,
    JSON.stringify({
      email: user.email,
      password: "wrong-password"
    }),
    {
      headers: {
        "Content-Type": "application/json",
        "X-Forwarded-For": fakeIp
      }
    }
  )

  const isBlocked = [401, 429].includes(res.status)

  blockedRate.add(isBlocked)

  check(res, {
    "blocked or unauthorized": () => isBlocked
  })

  if (!isBlocked) {
    console.log(`Unexpected response: ${res.status} - ${res.body}`)
  }
}

// DISTRIBUTED ATTACK TEST (LOGIN)
// Simula ataque distribuído com múltiplos IPs e usuários em alta taxa (RPS),
// evitando limitações por IP único.

// Objetivo: validar se o sistema mantém proteção mesmo sob ataque distribuído,
// garantindo bloqueio consistente (401/429) sem degradação ou respostas inesperadas.
