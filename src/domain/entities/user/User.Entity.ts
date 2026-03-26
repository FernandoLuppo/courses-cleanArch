export class User {
  private readonly _id: string
  private _name: string
  private _email: string
  private _password: string
  private readonly _createdAt: Date
  private _updatedAt: Date
  private _role: Role

  public constructor(
    id: string,
    name: string,
    email: string,
    password: string,
    createdAt: Date,
    updatedAt: Date,
    role: Role
  ) {
    this._id = id
    this._name = name
    this._email = email
    this._password = password
    this._createdAt = createdAt
    this._updatedAt = updatedAt
    this._role = role
  }

  static restore(
    id: string,
    name: string,
    email: string,
    password: string,
    createdAt: Date,
    updatedAt: Date,
    role: Role
  ): User {
    return new User(id, name, email, password, createdAt, updatedAt, role)
  }

  static create(
    id: string,
    name: string,
    email: string,
    password: string
  ): User {
    const newDate = new Date()
    return new User(id, name, email, password, newDate, newDate, "USER")
  }

  static createAdmin(
    id: string,
    name: string,
    email: string,
    password: string
  ): User {
    const newDate = new Date()
    return new User(id, name, email, password, newDate, newDate, "ADMIN")
  }

  public update(name: string, email: string, password: string): void {
    this._name = name
    this._email = email
    this._password = password
    this._updatedAt = new Date()
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
}

type Role = "ADMIN" | "USER"
