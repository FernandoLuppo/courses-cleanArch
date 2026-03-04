export interface IHashProvider {
  generateHash(password: string): Promise<string>
  compare(password: string, hashed: string): Promise<boolean>
}
