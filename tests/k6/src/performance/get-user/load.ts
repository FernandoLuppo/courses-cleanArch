// yarn k6 tests/k6/dist/performance/get-user/load.js -e BASE_URL=http://dot_api_test:3000

import http from "k6/http"
import { check } from "k6"
import { GetUserResponse } from "../../types"
const AUTHENTICATED_USERS = JSON.parse(
  open("../../../src/data/authenticated-users.json")
)

export const options = {
  scenarios: {
    load_test: {
      executor: "ramping-arrival-rate",
      startRate: 0,
      timeUnit: "1s",
      preAllocatedVUs: 100,
      maxVUs: 1000,

      stages: [
        { duration: "2m", target: 200 },
        { duration: "3m", target: 500 },
        { duration: "5m", target: 500 },
        { duration: "2m", target: 0 }
      ]
    }
  },

  thresholds: {
    http_req_duration: ["p(95)<100", "p(99)<200"],
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
}

// LOAD TEST (GET USER)
// Simula aumento progressivo de carga (até 500 req/s) utilizando ramping-arrival-rate,
// incluindo fase de plateau para validação de estabilidade.

// Objetivo: medir throughput sustentado, latência (p95/p99) e taxa de erro,
// garantindo consistência das respostas sob carga concorrente.
