// yarn k6 tests/k6/dist/performance/get-user/soak.js -e BASE_URL=http://dot_api_test:3000

import http from "k6/http"
import { check, sleep } from "k6"
import { GetUserResponse } from "../../types"

const AUTHENTICATED_USERS = JSON.parse(
  open("../../../src/data/authenticated-users.json")
)

export const options = {
  scenarios: {
    get_user_soak: {
      executor: "constant-vus",
      vus: 30,
      duration: "30m",
      gracefulStop: "30s"
    }
  },

  thresholds: {
    http_req_duration: ["p(95)<700"],
    http_req_failed: ["rate<0.01"],
    checks: ["rate>0.99"]
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

  sleep(Math.random() * 2 + 1)
}

// SOAK TEST (GET USER)
// Mantém concorrência constante (constant-vus) utilizando usuários pré-autenticados,
// com pacing randômico para simular comportamento realista e evitar padrões artificiais de carga.

// Objetivo: detectar degradação progressiva de latência, aumento de taxa de erro
// e inconsistência de dados ao longo do tempo sob carga sustentada.
