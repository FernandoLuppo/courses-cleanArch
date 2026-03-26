import { ISessionRepository } from "../../../domain/repositories/Session.Repository"
import { IUserRepository } from "../../../domain/repositories/User.Repository"
import { IHashGeneratorProvider } from "../../providers/HashGenerator.Provider"
import { ITokenProvider } from "../../providers/Token.Provider"
import { SessionErrors } from "../../../domain/entities/session/errors/Session.Errors"
import { Result } from "../../../shared/core/Result"

export class RotateSessionUseCase {
  public constructor(
    private readonly tokenProvider: ITokenProvider,
    private readonly userRepository: IUserRepository,
    private readonly sessionRepository: ISessionRepository,
    private readonly hashGeneratorProvider: IHashGeneratorProvider
  ) {}

  public async execute(input: InputProps): Promise<OutputProps> {
    if (!input.refreshToken)
      return Result.fail(SessionErrors.REFRESH_TOKEN_NOT_FOUND)

    const sha256Hash = this.hashGeneratorProvider.hash(input.refreshToken)
    const session =
      await this.sessionRepository.findByRefreshTokenHash(sha256Hash)

    if (!session) return Result.fail(SessionErrors.SESSION_NOT_FOUND)
    if (session.isExpired()) return Result.fail(SessionErrors.SESSION_EXPIRED)
    if (session.isRevoked) {
      await this.sessionRepository.revokeAllByUserId(session.userId)
      return Result.fail(SessionErrors.SESSION_REVOKED)
    }

    const user = await this.userRepository.findById(session.userId)
    if (!user) return Result.fail(SessionErrors.USER_NOT_FOUND)

    const newRefreshToken = this.tokenProvider.generateRefreshToken()
    const newRefreshTokenHash = this.hashGeneratorProvider.hash(newRefreshToken)

    await this.sessionRepository.rotateRefreshToken(
      session.id,
      newRefreshTokenHash
    )
    await this.sessionRepository.touch(session.id)

    const accessToken = this.tokenProvider.generateAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
      sessionId: session.id
    })

    return Result.ok({
      accessToken,
      refreshToken: newRefreshToken
    })
  }
}

type InputProps = {
  refreshToken: string
}

type Tokens = {
  accessToken: string
  refreshToken: string
}

type OutputProps = Result<Tokens>
