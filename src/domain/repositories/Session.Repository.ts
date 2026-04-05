import { Session } from "../entities/session/Session.Entity"

export interface ISessionRepository {
  createSession(data: {
    userId: string
    tokenHash: string
    userAgent?: string
    ip?: string
    expiresAt: Date
  }): Promise<Session>

  findByTokenHash(hash: string): Promise<Session | null>
  findActiveByUserId(userId: string): Promise<Session[]>

  rotateRefreshToken(sessionId: string, newHash: string): Promise<void>

  revoke(sessionId: string): Promise<void>
  revokeAllByUserId(userId: string): Promise<void>

  touch(sessionId: string): Promise<void>
}
