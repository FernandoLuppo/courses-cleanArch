import { Request, Response } from "express"
import { DeleteUserUseCase } from "../../../../application/use-cases/user/DeleteUserUseCase"

export class DeleteUserController {
  constructor(private readonly deleteUserUseCase: DeleteUserUseCase) {}

  public async handle(req: Request, res: Response) {
    const { email } = req.body

    await this.deleteUserUseCase.execute({ email })

    return res
      .status(200)
      .json({ ok: true, message: "User deleted successfully." })
  }
}
