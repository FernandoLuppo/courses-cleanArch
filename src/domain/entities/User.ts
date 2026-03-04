export class User {
  private readonly _uuid: string
  private readonly _name: string
  private readonly _email: string
  private readonly _password: string

  constructor(uuid: string, name: string, email: string, password: string) {
    this._uuid = uuid
    this._name = name
    this._email = email
    this._password = password
  }

  public getUser(): {
    name: string
    email: string
    uuid: string
  } {
    return {
      name: this._name,
      email: this._email,
      uuid: this._uuid
    }
  }
}
