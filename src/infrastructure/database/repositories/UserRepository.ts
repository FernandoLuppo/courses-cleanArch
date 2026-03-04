import { User } from "../../../domain/entities/User"
import { IUserRepository } from "../../../domain/repositories/IUserRepository"
import { prisma } from "../prisma/prisma-client"

export class UserRepository implements IUserRepository {
  create(user: User): Promise<boolean> {
    await prisma.c
  }

  deleteByEmail(email: string): Promise<boolean> {}

  findByEmail(email: string): Promise<User | null> {}

  update(user: User): Promise<void> {}
}
