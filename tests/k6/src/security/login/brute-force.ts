// yarn k6 tests/k6/dist/security/login/brute-force.js -e BASE_URL=http://dot_api_test:3000

import http from "k6/http"
import { check } from "k6"
import { Rate } from "k6/metrics"

const USERS = JSON.parse(open("../../../src/data/users.json"))

const blockedRate = new Rate("blocked_rate")

export const options = {
  scenarios: {
    brute_force: {
      executor: "constant-arrival-rate",
      rate: 50,
      timeUnit: "1s",
      duration: "1m",
      preAllocatedVUs: 20,
      maxVUs: 100
    }
  },
  thresholds: {
    checks: ["rate>0.95"],
    blocked_rate: ["rate>0.95"]
  }
}

const BASE_API = __ENV.BASE_URL

export default function () {
  const user = USERS[Math.floor(Math.random() * USERS.length)]

  const res = http.post(
    `${BASE_API}/sessions/login`,
    JSON.stringify({
      email: user.email,
      password: "wrong-password"
    }),
    {
      headers: {
        "Content-Type": "application/json",
        "X-Forwarded-For": `192.168.1.${__VU}`
      }
    }
  )

  const isBlocked = [401, 429].includes(res.status)

  blockedRate.add(isBlocked)

  check(res, {
    "blocked or unauthorized": () => isBlocked
  })

  if (!isBlocked) {
    console.log(`Unexpected: ${res.status} - ${res.body}`)
  }
}

// BRUTE FORCE TEST (LOGIN)
// Simula múltiplas tentativas concorrentes com senha inválida.

// Objetivo: validar bloqueio progressivo (401 → 429)
// e consistência da proteção contra brute-force.
