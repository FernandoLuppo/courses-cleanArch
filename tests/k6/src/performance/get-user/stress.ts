// yarn k6 tests/k6/dist/performance/get-user/stress.js -e BASE_URL=http://dot_api_test:3000

import http from "k6/http"
import { check, sleep } from "k6"
import { GetUserResponse } from "../../types"

const AUTHENTICATED_USERS = JSON.parse(
  open("../../../src/data/authenticated-users.json")
)

export const options = {
  scenarios: {
    get_user_stress: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "1m", target: 50 },
        { duration: "1m", target: 100 },
        { duration: "1m", target: 150 },
        { duration: "1m", target: 200 },
        { duration: "1m", target: 250 },
        { duration: "1m", target: 300 },
        { duration: "1m", target: 0 }
      ],
      gracefulRampDown: "30s"
    }
  },

  thresholds: {
    http_req_failed: ["rate<0.2"],
    checks: ["rate>0.9"]
  }
}

const BASE_API = __ENV.BASE_URL

export default function () {
  if (!AUTHENTICATED_USERS.length) {
    throw new Error("No authenticated users available")
  }

  const user =
    AUTHENTICATED_USERS[Math.floor(Math.random() * AUTHENTICATED_USERS.length)]

  const res = http.get(`${BASE_API}/users/get-one/${user.id}`, {
    headers: {
      Cookie: `accessToken=${user.accessToken}`
    }
  })

  let body: Partial<GetUserResponse> = {}

  if (res.status === 200) {
    try {
      body = res.json() as GetUserResponse
    } catch {
      // intentionally left blank
    }
  }

  check(res, {
    "status 200": r => r.status === 200,
    "success true": () => body.success === true,
    "correct user email": () => body.data?.email === user.email
  })

  sleep(Math.random() * 0.3)
}

// STRESS TEST (GET USER)
// Aumenta progressivamente a concorrência (ramping-vus) até níveis elevados,
// utilizando usuários pré-autenticados e pacing randômico curto para manter alta pressão.

// Objetivo: identificar o ponto de degradação do sistema (latência, erro e consistência),
// observando o comportamento sob carga crescente até próximo da saturação.
