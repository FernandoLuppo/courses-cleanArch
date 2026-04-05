export interface IBruteForceProvider {
  registerFailure(params: { email: string; ip: string }): Promise<void>
  isBlocked(params: { email: string; ip: string }): Promise<boolean>
  reset(params: { email: string; ip: string }): Promise<void>
  withLock<T>(key: string, fn: () => Promise<T>): Promise<T>
}
