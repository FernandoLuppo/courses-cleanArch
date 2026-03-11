export interface ILoggerProvider {
  info(data: unknown): void
  warn(data: unknown): void
  error(data: unknown): void
}
