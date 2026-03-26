import { UserErrors } from "../../../domain/entities/user/errors/User.Errors"
import { ISessionRepository } from "../../../domain/repositories/Session.Repository"
import { IUserRepository } from "../../../domain/repositories/User.Repository"
import { Result } from "../../../shared/core/Result"
import { IPasswordHasherProvider } from "../../providers/PasswordHasher.Provider"
import { IHashGeneratorProvider } from "../../providers/HashGenerator.Provider"
import { ITokenProvider } from "../../providers/Token.Provider"

export class LoginUseCase {
  public constructor(
    private readonly userRepository: IUserRepository,
    private readonly hashGeneratorProvider: IHashGeneratorProvider,
    private readonly tokenProvider: ITokenProvider,
    private readonly sessionRepository: ISessionRepository,
    private readonly passwordHasherProvider: IPasswordHasherProvider
  ) {}

  public async execute(input: InputProps): Promise<OutputProps> {
    const user = await this.userRepository.findByEmail(input.email)
    if (!user) return Result.fail(UserErrors.USER_NOT_FOUND)

    const isPasswordValid = await this.passwordHasherProvider.compare(
      input.password,
      user.password
    )
    if (!isPasswordValid) return Result.fail(UserErrors.INVALID_PASSWORD)

    const refreshToken = this.tokenProvider.generateRefreshToken()
    const refreshTokenHash = this.hashGeneratorProvider.hash(refreshToken)

    const activeSessions = await this.sessionRepository.findActiveByUserId(
      user.id
    )

    if (activeSessions.length >= 3) {
      const oldestSession = activeSessions[0]
      await this.sessionRepository.revoke(oldestSession.id)
    }

    const session = await this.sessionRepository.createSession({
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      ip: input.ip,
      refreshTokenHash,
      userAgent: input.userAgent,
      userId: user.id
    })

    const accessToken = this.tokenProvider.generateAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
      sessionId: session.id
    })

    return Result.ok({
      accessToken,
      refreshToken
    })
  }
}

type InputProps = {
  email: string
  password: string
  userAgent: string
  ip: string
}

type Tokens = {
  accessToken: string
  refreshToken: string
}

type OutputProps = Result<Tokens>
