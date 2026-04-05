import { Session as PrismaSession } from "@prisma/client"
import { Session } from "../../../domain/entities/session/Session.Entity"

export class SessionMapper {
  static toPrisma(session: Session): PrismaSession {
    return {
      id: session.id,
      userId: session.userId,
      tokenHash: session.tokenHash,
      userAgent: session.userAgent,
      ip: session.ip,
      expiresAt: session.expiresAt,
      isRevoked: session.isRevoked,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
      lastUsedAt: session.lastUsedAt
    }
  }

  static toDomain(prismaSession: PrismaSession): Session {
    return Session.restore(
      prismaSession.id,
      prismaSession.userId,
      prismaSession.tokenHash,
      prismaSession.userAgent,
      prismaSession.ip,
      prismaSession.expiresAt,
      prismaSession.isRevoked,
      prismaSession.createdAt,
      prismaSession.updatedAt,
      prismaSession.lastUsedAt
    )
  }
}
