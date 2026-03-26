import { LogoutUseCase } from "../../../application/use-cases/session/Logout.UseCase"
import { SessionRepository } from "../../../infrastructure/database/repositories/Session.Repository"
import { HashGeneratorProvider } from "../../../infrastructure/providers/HashGenerator.Provider"
import { LogoutController } from "../../../infrastructure/http/controllers/session/Logout.Controller"
import { prisma } from "../../../prisma/prisma-client"

export function logoutFactory() {
  const sessionRepository = new SessionRepository(prisma)
  const hashGeneratorProvider = new HashGeneratorProvider()

  const useCase = new LogoutUseCase(sessionRepository, hashGeneratorProvider)
  return new LogoutController(useCase)
}
