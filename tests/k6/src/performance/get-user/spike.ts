// yarn k6 tests/k6/dist/performance/get-user/spike.js -e BASE_URL=http://dot_api_test:3000

import http from "k6/http"
import { check, sleep } from "k6"
import { GetUserResponse } from "../../types"

const AUTHENTICATED_USERS = JSON.parse(
  open("../../../src/data/authenticated-users.json")
)

export const options = {
  scenarios: {
    get_user_spike: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "30s", target: 20 },
        { duration: "10s", target: 100 },
        { duration: "1m", target: 100 },
        { duration: "30s", target: 20 },
        { duration: "1m", target: 20 }
      ],
      gracefulRampDown: "10s"
    }
  },

  thresholds: {
    http_req_failed: ["rate<0.05"],
    checks: ["rate>0.95"]
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

  sleep(Math.random() * 0.5)
}

// SPIKE TEST (GET USER)
// Simula aumento abrupto de concorrência (ramping-vus), utilizando usuários pré-autenticados,
// com ramp-up agressivo e ramp-down controlado para avaliar comportamento sob picos transitórios.

// Objetivo: verificar a capacidade do sistema de absorver picos repentinos de carga,
// observando aumento de latência, taxa de erro e possíveis inconsistências durante e após o spike.
