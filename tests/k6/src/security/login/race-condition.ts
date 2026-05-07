// yarn k6 tests/k6/dist/security/login/race-condition.js -e BASE_URL=http://dot_api_test:3000

import http from "k6/http"
import { check } from "k6"
import { Rate } from "k6/metrics"

const blockedRate = new Rate("blocked_rate")

export const options = {
  scenarios: {
    race_condition: {
      executor: "constant-vus",
      vus: 50,
      duration: "10s"
    }
  },
  thresholds: {
    checks: ["rate>0.95"],
    blocked_rate: ["rate>0.9"]
  }
}

const BASE_API = __ENV.BASE_URL
const EMAIL = __ENV.TEST_EMAIL || "race@test.com"
const PASSWORD = "wrong-password"

export default function () {
  const res = http.post(
    `${BASE_API}/sessions/login`,
    JSON.stringify({
      email: EMAIL,
      password: PASSWORD
    }),
    {
      headers: {
        "Content-Type": "application/json",
        "X-Forwarded-For": `10.0.0.${__VU}`
      }
    }
  )

  const isBlocked = res.status === 429
  const isUnauthorized = res.status === 401

  blockedRate.add(isBlocked)

  check(res, {
    "only 401 or 429": () => isUnauthorized || isBlocked,
    "never succeeds under race": r => r.status !== 200,
    "returns valid error body": r =>
      r.status !== 429 ||
      (r.json("success") === false && r.json("code") === "TOO_MANY_REQUESTS")
  })
}

// RACE CONDITION TEST (LOGIN)
// Dispara múltiplas requisições simultâneas para a mesma conta,
// forçando concorrência extrema no fluxo de autenticação.

// Objetivo: validar que o sistema mantém consistência sob concorrência,
// garantindo ausência de race conditions (ex: múltiplos sucessos indevidos,
// bypass de lock ou inconsistência em loginAttempts).
