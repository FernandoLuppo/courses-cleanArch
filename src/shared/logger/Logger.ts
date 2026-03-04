export interface Logger {
  info(data: unknown): void
  warn(data: unknown): void
  error(data: unknown): void
}
