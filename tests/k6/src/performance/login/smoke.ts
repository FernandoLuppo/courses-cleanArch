// yarn k6 tests/k6/dist/performance/login/smoke.js -e BASE_URL=http://dot_api_test:3000

import { check } from "k6"
import http from "k6/http"
import { User, LoginResponse } from "../../types"

const USERS: User[] = JSON.parse(open("../../../src/data/users.json"))

export const options = {
  vus: 1,
  duration: "10s",
  thresholds: {
    http_req_failed: ["rate<0.01"],
    checks: ["rate>0.99"]
  }
}

const BASE_URL = __ENV.BASE_URL

export default function () {
  if (!USERS.length) {
    throw new Error("No users available")
  }

  const user = USERS[Math.floor(Math.random() * USERS.length)]

  const res = http.post(
    `${BASE_URL}/sessions/login`,
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

// SMOKE TEST (LOGIN)
// Executa uma requisição simples de login para validar disponibilidade do endpoint.

// Objetivo: garantir que o fluxo básico de autenticação está funcionando
// e que a resposta mantém o contrato esperado.
