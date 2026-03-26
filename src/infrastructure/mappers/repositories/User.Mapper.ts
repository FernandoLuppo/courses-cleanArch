import type { User as PrismaUser } from "@prisma/client"
import { User } from "../../../domain/entities/user/User.Entity"

export class UserMapper {
  static toPrisma(user: User): PrismaUser {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      role: user.role
    }
  }

  static toDomain(prismaUser: PrismaUser): User {
    return User.restore(
      prismaUser.id,
      prismaUser.name,
      prismaUser.email,
      prismaUser.password,
      prismaUser.createdAt,
      prismaUser.updatedAt,
      prismaUser.role
    )
  }
}
