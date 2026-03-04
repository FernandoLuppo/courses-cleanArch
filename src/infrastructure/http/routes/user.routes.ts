import { Request, Response, Router } from "express"
import { makeDeleteUserFactory } from "../factory/user/makeDeleteUserFactory"
import { makeCreateUserFactory } from "../factory/user/makeCreateUserFactory"

const userRoutes = Router()

const createUserController = makeCreateUserFactory()
const deleteUserController = makeDeleteUserFactory()

userRoutes.post("/create", (req: Request, res: Response) =>
  createUserController.handle(req, res)
)

userRoutes.delete("/delete/:email", (req: Request, res: Response) =>
  deleteUserController.handle(req, res)
)

export { userRoutes }
