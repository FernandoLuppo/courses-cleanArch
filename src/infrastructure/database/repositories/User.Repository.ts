import type { PrismaClient } from "@prisma/client"
import type { User } from "../../../domain/entities/user/User.Entity"
import type { IUserRepository } from "../../../domain/repositories/User.Repository"
import { UserMapper } from "../../mappers/User.mapper"

export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  public async create(user: User): Promise<User> {
    const prismaUser = UserMapper.toPrisma(user)
    await this.prisma.user.create({ data: prismaUser })
    return UserMapper.toDomain(prismaUser)
  }

  public async delete(id: string): Promise<boolean> {
    await this.prisma.user.delete({ where: { id } })
    return true
  }

  public async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } })
    if (!user) {
      return null
    }
    return UserMapper.toDomain(user)
  }

  public async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } })
    if (!user) {
      return null
    }
    return UserMapper.toDomain(user)
  }

  public async update(user: User): Promise<User | null> {
    const prismaUser = UserMapper.toPrisma(user)
    const updatedUser = await this.prisma.user.update({
      where: { id: prismaUser.id },
      data: prismaUser
    })
    return UserMapper.toDomain(updatedUser)
  }
}
