import { ISessionRepository } from "../../../domain/repositories/Session.Repository"
import { IUserRepository } from "../../../domain/repositories/User.Repository"
import { Result } from "../../../shared/core/Result"
import { IPasswordHasherProvider } from "../../providers/PasswordHasher.Provider"
import { IHashGeneratorProvider } from "../../providers/HashGenerator.Provider"
import { ITokenProvider } from "../../providers/Token.Provider"
import { IBruteForceProvider } from "../../providers/BruteForce.Provider"
import { SessionErrors } from "../../../domain/entities/session/errors/Session.Errors"

export class LoginUseCase {
  private readonly MAX_SESSIONS = 3
  private readonly SESSION_EXPIRATION_TIME = 7 * 24 * 60 * 60 * 1000 // 7 days

  public constructor(
    private readonly userRepository: IUserRepository,
    private readonly hashGeneratorProvider: IHashGeneratorProvider,
    private readonly tokenProvider: ITokenProvider,
    private readonly sessionRepository: ISessionRepository,
    private readonly passwordHasherProvider: IPasswordHasherProvider,
    private readonly bruteForceProvider: IBruteForceProvider
  ) {}

  public async execute(input: InputProps): Promise<OutputProps> {
    if (!input.userAgent || !input.ip) {
      return Result.fail(SessionErrors.UNAUTHORIZED)
    }

    // 1. O Redis rejeita rápido se o bucket estourou (IP/Email)
    const isBlockedInRedis = await this.bruteForceProvider.isBlocked({
      email: input.email,
      ip: input.ip
    })
    if (isBlockedInRedis) return Result.fail(SessionErrors.UNAUTHORIZED)

    // 2. Busca entidade de Usuário no banco
    const user = await this.userRepository.findByEmail(input.email)

    // Varíavel de controle para checar o lock persistente (salva no DB)
    const isBlockedInDb = user ? !user.canLogin() : false

    // 3. Dummy Hash - O tempo de resposta sempre será o mesmo (~300ms)

    const hashToCompare = user
      ? user.password
      : (process.env.DUMMY_HASH as string)

    // Compara independentemente da conta estar bloqueada ou mesmo existir
    const isPasswordValid = await this.passwordHasherProvider.compare(
      input.password,
      hashToCompare
    )

    // 4. REGRA FUNDAMENTAL: Bloqueio Consolidado
    // Se a conta não existe, OU a senha está errada, OU ele cumpriu o lock pelo DB: Acesso Negado
    if (!user || !isPasswordValid || isBlockedInDb) {
      if (user) {
        // Queremos incrementar o DB para refletir mais ataques e atualizar o lockUntil
        // A query atômica vai somar +1 lá no banco de dados sem os riscos de RMW.
        await this.userRepository.incrementFailedLogin(user.id)
      }

      // Consome tokens do Redis (penalidade para o atacante no nível do cache)
      await this.bruteForceProvider.registerFailure({
        email: input.email,
        ip: input.ip
      })

      // Único ponto de falha para tudo, o atacante nunca saberá o que errou.
      return Result.fail(SessionErrors.UNAUTHORIZED)
    }

    // --- DAQUI PARA BAIXO É O CAMINHO DE SUCESSO DO LOGIN ---
    // Preparar tokens aqui fora é mais leve e poupa tempo segurando o Distributed Lock
    const refreshToken = this.tokenProvider.generateRefreshToken()
    const tokenHash = this.hashGeneratorProvider.hash(refreshToken)

    // 5. Bloco Crítico Transacional com Lock (Sobe muro de contenção)
    const session = await this.bruteForceProvider.withLock(
      user.id,
      async () => {
        // Zeramos as falhas primeiro
        await this.userRepository.resetFailedLogin(user.id)

        // Varremos a quantia atual
        const activeSessions = await this.sessionRepository.findActiveByUserId(
          user.id
        )
        // Deletamos a excedente, se necessário
        if (activeSessions.length >= this.MAX_SESSIONS) {
          const oldestSession = activeSessions[0]
          await this.sessionRepository.revoke(oldestSession.id)
        }

        // CRÍTICO: Criar a sessão enquanto SE SEGURA a trava!
        // Do contrário outra execução paralela poderia pular o IF acima!
        return await this.sessionRepository.createSession({
          expiresAt: new Date(Date.now() + this.SESSION_EXPIRATION_TIME),
          ip: input.ip,
          tokenHash, // Usamos o token gerado acima fora do lock
          userAgent: input.userAgent,
          userId: user.id
        })
      }
    )

    // 6. Reset do balde de falhas do Redis
    await this.bruteForceProvider.reset({
      email: input.email,
      ip: input.ip
    })

    // 7. Geração de JWT e resposta (Rápido, estrito e concluído com sucesso)
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
