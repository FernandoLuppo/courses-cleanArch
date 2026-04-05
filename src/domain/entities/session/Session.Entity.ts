export class Session {
  private readonly _id: string
  private readonly _userId: string
  private readonly _tokenHash: string
  private _isRevoked: boolean
  private readonly _expiresAt: Date
  private readonly _userAgent: string | null
  private readonly _ip: string | null
  private readonly _createdAt: Date
  private readonly _updatedAt: Date
  private readonly _lastUsedAt: Date

  public constructor(
    id: string,
    userId: string,
    tokenHash: string,
    isRevoked: boolean,
    expiresAt: Date,
    userAgent: string | null,
    ip: string | null,
    createdAt: Date,
    updatedAt: Date,
    lastUsedAt: Date
  ) {
    this._id = id
    this._userId = userId
    this._tokenHash = tokenHash
    this._isRevoked = isRevoked
    this._expiresAt = expiresAt
    this._userAgent = userAgent
    this._ip = ip
    this._createdAt = createdAt
    this._updatedAt = updatedAt
    this._lastUsedAt = lastUsedAt
  }

  public isExpired(): boolean {
    return new Date() > this.expiresAt
  }

  public revoke(): void {
    this._isRevoked = true
  }

  static restore(
    id: string,
    userId: string,
    tokenHash: string,
    userAgent: string | null,
    ip: string | null,
    expiresAt: Date,
    isRevoked: boolean,
    createdAt: Date,
    updatedAt: Date,
    lastUsedAt: Date
  ): Session {
    return new Session(
      id,
      userId,
      tokenHash,
      isRevoked,
      expiresAt,
      userAgent,
      ip,
      createdAt,
      updatedAt,
      lastUsedAt
    )
  }

  get id(): string {
    return this._id
  }
  get userId(): string {
    return this._userId
  }
  get tokenHash(): string {
    return this._tokenHash
  }
  get isRevoked(): boolean {
    return this._isRevoked
  }
  get expiresAt(): Date {
    return this._expiresAt
  }
  get userAgent(): string | null {
    return this._userAgent
  }
  get ip(): string | null {
    return this._ip
  }
  get createdAt(): Date {
    return this._createdAt
  }
  get updatedAt(): Date {
    return this._updatedAt
  }
  get lastUsedAt(): Date {
    return this._lastUsedAt
  }
}
