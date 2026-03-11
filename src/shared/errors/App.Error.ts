export interface AppErrorProps {
  message: string
  statusCode: number
  code: string
  details?: unknown
  isOperational?: boolean
}

export class AppError extends Error {
  public readonly statusCode: number
  public readonly code: string
  public readonly details?: unknown
  public readonly isOperational: boolean

  constructor({
    message,
    statusCode,
    code,
    details,
    isOperational = true
  }: AppErrorProps) {
    super(message)

    this.statusCode = statusCode
    this.code = code
    this.details = details
    this.isOperational = isOperational

    Object.setPrototypeOf(this, new.target.prototype)
  }
}
