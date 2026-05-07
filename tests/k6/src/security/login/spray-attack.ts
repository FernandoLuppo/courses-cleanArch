// yarn k6 tests/k6/dist/security/login/spray-attack.js -e TEST_BASE_URL=http://dot_api:3000

import http from "k6/http"
import { check, sleep } from "k6"

export const options = {
  vus: 5,
  duration: "20s"
}

const PASSWORD = "Password123@"
const BASE_API = __ENV.TEST_BASE_URL

export default function () {
  const EMAIL = `fake${__ITER}@gmail.com`

  const res = http.post(
    `${BASE_API}/sessions/login`,
    JSON.stringify({
      email: EMAIL,
      password: PASSWORD
    }),
    {
      headers: { "Content-Type": "application/json" }
    }
  )

  check(res, {
    "status 401/429": r => [401, 429].includes(r.status)
  })

  sleep(0.1)
}

//  SPRAY ATTACK TEST (LOGIN)
//  Simula tentativas de login com mesma senha em múltiplas contas.

//  Objetivo: Validar proteção contra password spraying (ataques distribuídos por usuários).
