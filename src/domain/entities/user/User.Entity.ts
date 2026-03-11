export class User {
  private readonly _id: string
  private _name: string
  private _email: string
  private _password: string
  private readonly _createdAt: Date
  private _updatedAt: Date

  constructor(
    id: string,
    name: string,
    email: string,
    password: string,
    createdAt: Date,
    updatedAt: Date
  ) {
    this._id = id
    this._name = name
    this._email = email
    this._password = password
    this._createdAt = createdAt
    this._updatedAt = updatedAt
  }

  static restore(
    id: string,
    name: string,
    email: string,
    password: string,
    createdAt: Date,
    updatedAt: Date
  ): User {
    return new User(id, name, email, password, createdAt, updatedAt)
  }

  static create(
    id: string,
    name: string,
    email: string,
    password: string
  ): User {
    const newDate = new Date()
    return new User(id, name, email, password, newDate, newDate)
  }

  update(name: string, email: string, password: string): void {
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
}
