import { Router } from "express"

export function testRoutes() {
  const router = Router()

  router.get("/health", (req, res) => {
    return res.status(200).json({ status: "ok" })
  })

  return router
}
