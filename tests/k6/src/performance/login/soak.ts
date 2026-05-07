// yarn k6 tests/k6/dist/performance/login/soak.js -e BASE_URL=http://dot_api_test:3000

import http from "k6/http"
import { check, sleep } from "k6"
import { User, LoginResponse } from "../../types"

const USERS: User[] = JSON.parse(open("../../../src/data/users.json"))

export const options = {
  scenarios: {
    login_soak: {
      executor: "constant-vus",
      vus: 30,
      duration: "30m",
      gracefulStop: "30s"
    }
  },
  thresholds: {
    http_req_duration: ["p(95)<2000"],
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

  sleep(Math.random() * 2 + 1)
}

// SOAK TEST (LOGIN)
// Mantém carga constante de logins por longo período para avaliar estabilidade do sistema ao longo do tempo.

// Objetivo: identificar degradação progressiva, vazamento de recursos e impacto contínuo do custo de autenticação.
