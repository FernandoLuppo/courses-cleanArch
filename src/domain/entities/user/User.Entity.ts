export class User {
  private readonly _id: string
  private _name: string
  private _email: string
  private _password: string
  private readonly _createdAt: Date
  private _updatedAt: Date
  private _role: Role
  private _loginAttempts: number
  private _lockUntil: Date | null

  public constructor(
    id: string,
    name: string,
    email: string,
    password: string,
    createdAt: Date,
    updatedAt: Date,
    role: Role,
    loginAttempts: number,
    lockUntil: Date | null
  ) {
    this._id = id
    this._name = name
    this._email = email
    this._password = password
    this._createdAt = createdAt
    this._updatedAt = updatedAt
    this._role = role
    this._loginAttempts = loginAttempts
    this._lockUntil = lockUntil
  }

  static restore(
    id: string,
    name: string,
    email: string,
    password: string,
    createdAt: Date,
    updatedAt: Date,
    role: Role,
    loginAttempts: number,
    lockUntil: Date | null
  ): User {
    return new User(
      id,
      name,
      email,
      password,
      createdAt,
      updatedAt,
      role,
      loginAttempts,
      lockUntil
    )
  }

  static create(
    id: string,
    name: string,
    email: string,
    password: string
  ): User {
    const newDate = new Date()
    return new User(
      id,
      name,
      email,
      password,
      newDate,
      newDate,
      "USER",
      0,
      null
    )
  }

  static createAdmin(
    id: string,
    name: string,
    email: string,
    password: string
  ): User {
    const newDate = new Date()
    return new User(
      id,
      name,
      email,
      password,
      newDate,
      newDate,
      "ADMIN",
      0,
      null
    )
  }

  public update(name: string): void {
    this._name = name
    this._updatedAt = new Date()
  }

  public canLogin(): boolean {
    return !this._lockUntil || this._lockUntil < new Date()
  }

  public registerSuccessfulLogin(): void {
    this._loginAttempts = 0
    this._lockUntil = null
  }

  get id() {
    return this._id
  }
  get name() {
    return this._name
  }
  get email() {
    return this._email
  }
  get password() {
    return this._password
  }
  get createdAt() {
    return this._createdAt
  }
  get updatedAt() {
    return this._updatedAt
  }
  get role() {
    return this._role
  }
  get loginAttempts() {
    return this._loginAttempts
  }
  get lockUntil() {
    return this._lockUntil
  }
}

type Role = "ADMIN" | "USER"
