// yarn k6 tests/k6/dist/security/rate-limit.js -e BASE_URL=http://dot_api_test:3000

import http from "k6/http"
import { check } from "k6"
import { Rate } from "k6/metrics"

const blockedRate = new Rate("blocked_rate")

export const options = {
  scenarios: {
    rate_limit_attack: {
      executor: "per-vu-iterations",
      vus: 10,
      iterations: 120
    }
  },
  thresholds: {
    checks: ["rate>0.99"],
    blocked_rate: ["rate>0.2"]
  }
}

const BASE_API = __ENV.BASE_URL

export default function () {
  const ip = `192.168.0.${__VU}`

  let blocked = false

  for (let i = 0; i < 120; i++) {
    const res = http.get(`${BASE_API}/tests/health`, {
      headers: {
        "X-Forwarded-For": ip
      }
    })

    const isBlocked = res.status === 429

    if (isBlocked) {
      blocked = true
    }

    blockedRate.add(isBlocked)

    check(res, {
      "status is 200 or 429": r => r.status === 200 || r.status === 429,
      "returns correct error body when blocked": r =>
        r.status !== 429 ||
        (r.json("code") === "TOO_MANY_REQUESTS" && r.json("success") === false)
    })
  }

  if (blocked) {
    const res = http.get(`${BASE_API}/tests/health`, {
      headers: {
        "X-Forwarded-For": ip
      }
    })

    blockedRate.add(res.status === 429)

    check(res, {
      "still blocked after limit": r => r.status === 429
    })
  }
}

// RATE LIMIT TEST
// Simula múltiplas requisições por IP para forçar limite.

// Objetivo: validar bloqueio (429) e persistência após exceder limite.
