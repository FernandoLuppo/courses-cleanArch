// yarn k6 tests/k6/dist/performance/login/stress.js -e BASE_URL=http://dot_api_test:3000

import http from "k6/http"
import { check } from "k6"
import { User, LoginResponse } from "../../types"

const USERS: User[] = JSON.parse(open("../../../src/data/users.json"))

export const options = {
  scenarios: {
    login_stress: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "1m", target: 100 },
        { duration: "1m", target: 200 },
        { duration: "1m", target: 400 },
        { duration: "1m", target: 600 },
        { duration: "1m", target: 800 },
        { duration: "1m", target: 1000 },
        { duration: "1m", target: 0 }
      ],
      gracefulRampDown: "30s"
    }
  },
  thresholds: {
    http_req_failed: ["rate<0.2"],
    http_req_duration: ["p(95)<5000"],
    checks: ["rate>0.95"]
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

// STRESS TEST (LOGIN)
// Aumenta progressivamente a carga até níveis extremos para forçar o sistema ao limite.

// Objetivo: identificar ponto de degradação, comportamento sob saturação e momento de falha da autenticação.
