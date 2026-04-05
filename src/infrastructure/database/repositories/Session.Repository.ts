import { PrismaClient } from "@prisma/client"
import { ISessionRepository } from "../../../domain/repositories/Session.Repository"
import { Session } from "../../../domain/entities/session/Session.Entity"
import { SessionMapper } from "../../mappers/repositories/Session.Mapper"

export class SessionRepository implements ISessionRepository {
  public constructor(private readonly prisma: PrismaClient) {}

  public async createSession(data: {
    userId: string
    tokenHash: string
    userAgent?: string
    ip?: string
    expiresAt: Date
  }): Promise<Session> {
    const session = await this.prisma.session.create({
      data
    })

    return SessionMapper.toDomain(session)
  }

  public async findByTokenHash(tokenHash: string): Promise<Session | null> {
    const session = await this.prisma.session.findFirst({
      where: { tokenHash }
    })

    if (!session) return null

    return SessionMapper.toDomain(session)
  }

  public async findActiveByUserId(userId: string): Promise<Session[]> {
    const sessions = await this.prisma.session.findMany({
      where: { userId, isRevoked: false, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: "asc" }
    })

    return sessions.map(SessionMapper.toDomain)
  }

  public async rotateRefreshToken(
    sessionId: string,
    newTokenHash: string
  ): Promise<void> {
    await this.prisma.session.update({
      where: { id: sessionId },
      data: {
        tokenHash: newTokenHash,
        lastUsedAt: new Date()
      }
    })
  }

  public async revoke(sessionId: string): Promise<void> {
    await this.prisma.session.update({
      where: { id: sessionId },
      data: {
        isRevoked: true
      }
    })
  }

  public async revokeAllByUserId(userId: string): Promise<void> {
    await this.prisma.session.updateMany({
      where: { userId, isRevoked: false },
      data: { isRevoked: true }
    })
  }

  public async touch(sessionId: string): Promise<void> {
    await this.prisma.session.update({
      where: { id: sessionId },
      data: {
        lastUsedAt: new Date()
      }
    })
  }
}
