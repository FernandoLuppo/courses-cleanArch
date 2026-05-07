// yarn k6 tests/k6/dist/performance/login/load.js -e BASE_URL=http://dot_api_test:3000

import http from "k6/http"
import { check } from "k6"
import { User, LoginResponse } from "../../types"

const USERS: User[] = JSON.parse(open("../../../src/data/users.json"))

export const options = {
  scenarios: {
    login_load: {
      executor: "ramping-arrival-rate",
      startRate: 0,
      timeUnit: "1s",
      preAllocatedVUs: 100,
      maxVUs: 1000,

      stages: [
        { duration: "2m", target: 100 },
        { duration: "3m", target: 300 },
        { duration: "5m", target: 300 },
        { duration: "2m", target: 0 }
      ]
    }
  },

  thresholds: {
    http_req_duration: ["p(95)<2000", "p(99)<3000"],
    http_req_failed: ["rate<0.01"],
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

// LOAD TEST (LOGIN)
// Simula aumento progressivo de requisições de login utilizando ramping-arrival-rate,
// com foco em throughput sob carga concorrente.

// Objetivo: medir latência (p95/p99), taxa de erro e consistência das respostas,
// considerando o custo computacional do processo de autenticação.
