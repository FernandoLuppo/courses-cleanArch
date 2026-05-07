// yarn k6 tests/k6/dist/performance/get-user/smoke.js -e BASE_URL=http://dot_api_test:3000

import http from "k6/http"
import { check, sleep } from "k6"
import { GetUserResponse } from "../../types"

const AUTHENTICATED_USERS = JSON.parse(
  open("../../../src/data/authenticated-users.json")
)

export const options = {
  vus: 1,
  duration: "10s",

  thresholds: {
    http_req_duration: ["p(95)<200"],
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

  sleep(0.2)
}

// SMOKE TEST (GET USER)
// Executa carga mínima (1 VU) utilizando usuários pré-autenticados.

// Objetivo: validar rapidamente disponibilidade, autenticação e consistência da resposta
// antes da execução de testes mais pesados.
