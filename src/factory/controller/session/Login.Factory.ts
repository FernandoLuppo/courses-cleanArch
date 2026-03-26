import { LoginUseCase } from "../../../application/use-cases/session/Login.UseCase"
import { UserRepository } from "../../../infrastructure/database/repositories/User.Repository"
import { LoginController } from "../../../infrastructure/http/controllers/session/Login.Controller"
import { HashGeneratorProvider } from "../../../infrastructure/providers/HashGenerator.Provider"
import { TokenProvider } from "../../../infrastructure/providers/Token.Provider"
import { SessionRepository } from "../../../infrastructure/database/repositories/Session.Repository"
import { prisma } from "../../../prisma/prisma-client"
import { PasswordHasherProvider } from "../../../infrastructure/providers/PasswordHasher.Provider"

export function loginFactory() {
  const userRepository = new UserRepository(prisma)
  const sessionRepository = new SessionRepository(prisma)

  const passwordHasherProvider = new PasswordHasherProvider()
  const hashGeneratorProvider = new HashGeneratorProvider()
  const tokenProvider = new TokenProvider()

  const useCase = new LoginUseCase(
    userRepository,
    hashGeneratorProvider,
    tokenProvider,
    sessionRepository,
    passwordHasherProvider
  )
  return new LoginController(useCase)
}
