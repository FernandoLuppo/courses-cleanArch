import { LoginUseCase } from "../../../application/use-cases/session/Login.UseCase"
import { UserRepository } from "../../../infrastructure/database/repositories/User.Repository"
import { LoginController } from "../../../infrastructure/http/controllers/session/Login.Controller"
import { HashGeneratorProvider } from "../../../infrastructure/providers/HashGenerator.Provider"
import { TokenProvider } from "../../../infrastructure/providers/Token.Provider"
import { SessionRepository } from "../../../infrastructure/database/repositories/Session.Repository"
import { prisma } from "../../../prisma/prisma-client"
import { PasswordHasherProvider } from "../../../infrastructure/providers/PasswordHasher.Provider"
import { BruteForceProvider } from "../../../infrastructure/providers/BruteForce.Provider"
import { LoggerProvider } from "../../../infrastructure/providers/Logger.Provider"

export function loginFactory() {
  const userRepository = new UserRepository(prisma)
  const sessionRepository = new SessionRepository(prisma)
  const loggerProvider = new LoggerProvider()

  const passwordHasherProvider = new PasswordHasherProvider()
  const hashGeneratorProvider = new HashGeneratorProvider()
  const tokenProvider = new TokenProvider()

  const bruteForceProvider = new BruteForceProvider(loggerProvider)

  const useCase = new LoginUseCase(
    userRepository,
    hashGeneratorProvider,
    tokenProvider,
    sessionRepository,
    passwordHasherProvider,
    bruteForceProvider
  )

  return new LoginController(useCase)
}
