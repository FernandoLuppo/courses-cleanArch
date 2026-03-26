export interface IPasswordHasherProvider {
  generateHash(password: string): Promise<string>
  compare(password: string, hashed: string): Promise<boolean>
}
