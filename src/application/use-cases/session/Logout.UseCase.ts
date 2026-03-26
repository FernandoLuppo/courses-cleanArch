import { SessionErrors } from "../../../domain/entities/session/errors/Session.Errors"
import { ISessionRepository } from "../../../domain/repositories/Session.Repository"
import { Result } from "../../../shared/core/Result"
import { IHashGeneratorProvider } from "../../providers/HashGenerator.Provider"

export class LogoutUseCase {
  public constructor(
    private readonly sessionRepository: ISessionRepository,
    private readonly hashGeneratorProvider: IHashGeneratorProvider
  ) {}

  public async execute(input: InputProps): Promise<OutputProps> {
    if (!input.refreshToken)
      return Result.fail(SessionErrors.REFRESH_TOKEN_NOT_FOUND)

    const refreshTokenHash = this.hashGeneratorProvider.hash(input.refreshToken)
    const session =
      await this.sessionRepository.findByRefreshTokenHash(refreshTokenHash)

    if (!session) return Result.fail(SessionErrors.SESSION_NOT_FOUND)

    await this.sessionRepository.revoke(session.id)
    return Result.okVoid()
  }
}

type InputProps = {
  refreshToken: string
}

type OutputProps = Result<void>
