import type { CreateUserUseCase } from "../../../../application/use-cases/user/CreateUserUseCase"
import type { Request, Response } from "express"

export class CreateUserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  public async handle(req: Request, res: Response) {
    const { name, email, password } = req.body

    await this.createUserUseCase.execute({ name, email, password })

    return res
      .status(201)
      .json({ ok: true, message: "User created successfully." })
  }
}
