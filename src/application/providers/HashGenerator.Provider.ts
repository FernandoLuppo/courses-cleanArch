export interface IHashGeneratorProvider {
  hash(token: string): string
}
