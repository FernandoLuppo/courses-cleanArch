import { TokenProvider } from "../../../infrastructure/providers/Token.Provider"
import { UserRepository } from "../../../infrastructure/database/repositories/User.Repository"
import { prisma } from "../../../prisma/prisma-client"
import { RotateSessionUseCase } from "../../../application/use-cases/session/RotateSession.UseCase"
import { RotateSessionController } from "../../../infrastructure/http/controllers/session/Auth.Controller"
import { SessionRepository } from "../../../infrastructure/database/repositories/Session.Repository"
import { HashGeneratorProvider } from "../../../infrastructure/providers/HashGenerator.Provider"

export function rotateSessionFactory() {
  const userRepository = new UserRepository(prisma)
  const sessionRepository = new SessionRepository(prisma)

  const tokenProvider = new TokenProvider()
  const hashGeneratorProvider = new HashGeneratorProvider()

  const useCase = new RotateSessionUseCase(
    tokenProvider,
    userRepository,
    sessionRepository,
    hashGeneratorProvider
  )

  return new RotateSessionController(useCase)
}
