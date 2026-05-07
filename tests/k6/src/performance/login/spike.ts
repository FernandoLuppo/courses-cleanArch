// yarn k6 tests/k6/dist/performance/login/spike.js -e BASE_URL=http://dot_api_test:3000

import http from "k6/http"
import { check } from "k6"
import { User, LoginResponse } from "../../types"

const USERS: User[] = JSON.parse(open("../../../src/data/users.json"))

export const options = {
  scenarios: {
    login_spike: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "30s", target: 20 },
        { duration: "10s", target: 120 },
        { duration: "1m", target: 120 },
        { duration: "30s", target: 20 },
        { duration: "1m", target: 20 }
      ],
      gracefulRampDown: "10s"
    }
  },
  thresholds: {
    http_req_failed: ["rate<0.05"],
    http_req_duration: ["p(95)<3000"],
    checks: ["rate>0.99"]
  }
}

const BASE_API = __ENV.BASE_URL

export default function () {
  if (!USERS.length) {
    throw new Error("No users available")
  }

  const user = USERS[__VU % USERS.length]

  const res = http.post(
    `${BASE_API}/sessions/login`,
    JSON.stringify({
      email: user.email,
      password: user.password
    }),
    {
      headers: { "Content-Type": "application/json" }
    }
  )

  let body: Partial<LoginResponse> = {}

  if (res.status === 200) {
    try {
      body = res.json() as LoginResponse
    } catch {
      // intentionally left blank
    }
  }

  check(res, {
    "status 200": r => r.status === 200,
    "success true": () => body.success === true,
    "correct user email": () => body.data?.email === user.email
  })
}

// SPIKE TEST (LOGIN)
// Simula aumento abrupto de carga com crescimento rápido de VUs para validar comportamento sob picos.

// Objetivo: avaliar capacidade de absorver picos, impacto na latência e taxa de erro durante e após o spike.
