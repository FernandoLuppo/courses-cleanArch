import { Request, Response, Router } from "express"
import { deleteUserFactory } from "../factory/user/DeleteUser.Factory"
import { createUserFactory } from "../factory/user/CreateUser.Factory"
import { updateUserFactory } from "../factory/user/UpdateUser.Factory"
import { GetUserFactory } from "../factory/user/GetUser.Factory"

const userRoutes = Router()

const createUserController = createUserFactory()
const deleteUserController = deleteUserFactory()
const updateUserController = updateUserFactory()
const getUserController = GetUserFactory()

userRoutes.post("/create", (req: Request, res: Response) =>
  createUserController.handle(req, res)
)

userRoutes.delete("/delete/:id", (req: Request, res: Response) =>
  deleteUserController.handle(req, res)
)

userRoutes.patch("/update/:id", (req: Request, res: Response) =>
  updateUserController.handle(req, res)
)

userRoutes.get("/get/:id", (req: Request, res: Response) =>
  getUserController.handle(req, res)
)

export { userRoutes }
